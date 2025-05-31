export default async function processIdea(idea: any) {
  try {
    // create the session
    const responseSession = await fetch(
      `${process.env.API_AGENT_URL!}/apps/creator_companion_agent/users/u_${idea?.userId?.toString()}/sessions/s_${idea?._id?.toString() ?? idea?.id?.toString()}_${Date.now()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    // get the data
    const dataSession = await responseSession.json()

    const response = await fetch(`${process.env.API_AGENT_URL!}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appName: 'creator_companion_agent',
        userId: dataSession.userId,
        sessionId: dataSession.id,
        newMessage: {
          role: 'user',
          parts: [
            {
              text: `${idea?.prompt} and the idea ID is ${idea?._id?.toString() ?? idea?.id?.toString()}`,
            },
          ],
        },
      }),
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.error(error)
  }
}
