import { getAllMetaPosts } from './airtable'
import kebabCase from './utils/kebabCase'
import matter from 'gray-matter'

const root = process.cwd()

export async function getAllTags() {
  const metaPosts = await getAllMetaPosts()

  let tagCount = {}
  // Iterate through each post, putting all found tags into `tags`
  metaPosts.forEach((meta) => {
    const { data } = matter(meta['Metadata'])
    if (data.tags) {
      data.tags.forEach((tag) => {
        const formattedTag = kebabCase(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })

  return tagCount
}
