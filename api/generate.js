module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'LARPify API is running ✅' })
  }

  try {
    const { prompt, imageUrl } = req.body || {}

    if (!prompt) return res.status(400).json({ error: 'No prompt provided' })

    const body = {
      prompt,
      image_size: 'portrait_4_3',
      num_inference_steps: 4,
      num_images: 1,
    }

    if (imageUrl) {
      body.image_url = imageUrl
      body.strength = 0.85
    }

    const fal = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await fal.json()
    console.log('fal response:', JSON.stringify(data))
    res.status(200).json({ imageUrl: data.images?.[0]?.url || null })

  } catch(err) {
    console.log('error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
