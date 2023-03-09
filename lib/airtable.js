import Airtable from 'airtable'
import { SLUG_TYPES } from './mdx'

const airtable = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN })
const base = airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID)

const getMinifiedRecords = (records) => {
  return records.map((record) => minifyRecord(record))
}

const minifyRecord = (record) => {
  return {
    id: record.id,
    ...record.fields,
  }
}

async function getTable(table) {
  const records = await base(table).select({}).all()

  return getMinifiedRecords(records)
}

/*
  Get post need to publish by checking:
    1. Status = Draft and PublishedDate <= Today
    2. Status = Updated and PublishedDate <= Today
  Then update Status = 'Published' and 'PublishedDate' = Today
 */
async function syncPublishedPosts() {
  const records = await base('Blog')
    .select({
      filterByFormula: `AND(
        OR(
          {Status} = "Draft", 
          {Status} = "Updated"
        ), 
        NOT(
          IS_AFTER({PublishedDate}, TODAY())
        )
      )`,
    })
    .all()
  if (records && records.length > 0) {
    await updatePostsToPublishedStatus(records)
  }
}

async function updatePostsToPublishedStatus(records) {
  const today = new Date()
  await base(`Blog`).update(
    records.map((post) => ({
      id: post.id,
      fields: {
        // mm/dd/yyyy
        PublishedDate: `${today.getMonth()}/${today.getDate()}/${today.getFullYear()}`,
        Status: 'Published',
      },
    })),
    null
  )
}

/*
  Get published post:
    1. Status = Published
 */
async function getPublishedPosts() {
  const records = await base('Blog')
    .select({
      filterByFormula: `OR({Status} = "Published")`,
    })
    .all()

  return getMinifiedRecords(records)
}

/*
  Get metadata publish post:
    1. Status = Published
 */
async function getAllMetaPosts() {
  const records = await base('Blog')
    .select({
      fields: ['Slug', 'Metadata'],
      filterByFormula: `
      AND(
        {Status} = "Published"
      )
    `,
    })
    .all()

  return getMinifiedRecords(records)
}

/*
  Get post content:
    1. Status = Published
    2. Type = SLUG_TYPES
 */
async function getPost(type, slug) {
  let base = 'Blog'
  if (type === SLUG_TYPES.PROJECT) {
    base = 'Project'
  }
  const records = await base(base)
    .select({
      filterByFormula: `AND(
        {Status} = "Published"
        )`,
    })
    .firstPage()
  if (records && records.length > 0) {
    return minifyRecord(records[0])
  }
  return ''
}

export { getAllMetaPosts, getPost, getPublishedPosts }
