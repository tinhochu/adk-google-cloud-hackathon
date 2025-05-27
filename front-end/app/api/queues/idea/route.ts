import processIdea from '@/helpers/processIdea'
import connectMongo from '@/lib/mongoose'
import Idea from '@/models/Idea'
import { Queue } from 'quirrel/next-app'

export const ideaQueue = Queue('api/queues/idea', async (idea: any) => {
  try {
    await connectMongo()
    const response = await processIdea(idea)

    // find in the Array the author 'ContentPackagerAgent'
    const contentPackagerAgent = response.find((item: any) => item.author === 'ContentPackagerAgent')

    // if there is no contentPackagerAgent, return
    if (!contentPackagerAgent) return

    const jsonData = contentPackagerAgent.content?.parts[0]?.text.replace(/```json\n|```/g, '')
    const generatedPackage = JSON.parse(jsonData)

    // update the idea with the generated package
    await Idea.findByIdAndUpdate(idea.id, {
      $set: {
        status: 'completed',
        ...generatedPackage,
      },
    })
  } catch (error) {
    console.error(error)
  }
})

export const POST = ideaQueue
