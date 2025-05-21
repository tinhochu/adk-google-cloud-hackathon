export async function PUT(request: Request) {
  try {
    // Get the user id from the request
    const data = await request.json()

    console.log({ data })

    return new Response('Ideas updated', { status: 200 })
  } catch (error) {
    console.error('Error Updating ideas:', error)
    return new Response('Error Updating ideas', { status: 500 })
  }
}
