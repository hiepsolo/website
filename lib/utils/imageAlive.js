export default async function isImageAlive(src) {
  try {
    const res = await fetch(src)
    if (res.status < 300) {
      return true
    }
  } catch (error) {
    return false
  }
  return false
}
