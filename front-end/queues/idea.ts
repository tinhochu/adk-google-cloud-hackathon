import processIdea from '@/helpers/processIdea'
import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import Pusher from 'pusher'
import { Queue } from 'quirrel/next-app'

export const ideaQueue = Queue('api/queues/idea', async (idea: any) => {
  try {
    await connectMongo()
    const pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: 'us2',
      useTLS: true,
    })

    console.log('::squirrel:: processing idea', idea.id)
    const response = await processIdea(idea)

    // find in the Array the author 'ContentPackagerAgent'
    const contentPackagerAgent = response.find((item: any) => item.author === 'ContentPackagerAgent')

    // if there is no contentPackagerAgent, return
    if (!contentPackagerAgent) {
      console.log('::squirrel:: No content packager agent', idea.id)
      return
    }

    console.log('::squirrel:: Content packager agent', contentPackagerAgent)
    const jsonData = contentPackagerAgent.content?.parts[0]?.text.replace(/```json\n|```/g, '')
    const generatedPackage = JSON.parse(jsonData)

    // update the idea with the generated package
    console.log('::squirrel:: Updating idea', idea.id)
    await Idea.findByIdAndUpdate(idea.id, {
      $set: {
        status: 'completed',
        ...generatedPackage,
      },
    })

    console.log('::squirrel:: Triggering pusher', idea.id)
    pusher.trigger(`task/${idea.id}`, 'task-status-update', {
      status: 'completed',
      message: 'Idea completed',
      ideaId: idea.id,
    })

    console.log('::squirrel:: Idea completed', idea.id)
  } catch (error) {
    console.error(`Error processing idea ${idea.id}: ${error}`)
  }
})
