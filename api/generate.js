export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { prompt, imageUrl } = req.body

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
  res.json({ imageUrl: data.images?.[0]?.url || null })
}
