export default async function handler(req, res) {
  if (!req.query.secret || req.query.secret !== process.env.NEXT_PUBLIC_REVALIDATE_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    if (!req.query.paths) {
      return res.status(400).send('Paths is required')
    }
    const paths = req.query.paths.split(',')
    for (let i = 0; i < paths.length; i++) {
      await res.revalidate(paths[i])
    }

    return res.json({ revalidated: true })
  } catch (err) {
    return res.status(500).send('Error revalidating')
  }
}
