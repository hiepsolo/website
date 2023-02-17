import Airtable from 'airtable'

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
  const records = await base('Contents')
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
  await base(`Contents`).update(
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
  const records = await base('Contents')
    .select({
      filterByFormula: `{Status} = "Published"`,
    })
    .all()

  return getMinifiedRecords(records)
}

async function getAllPosts() {
  const records = await base('Contents').select({}).all()

  return getMinifiedRecords(records)
}

export { getAllPosts }
