import { SLUG_TYPES, formatSlug, getAllPostsFrontMatter, getFileBySlug } from '@/lib/mdx'
import { getAllMetaPosts, getPost, getPublishedPosts } from '@/lib/airtable'

import { MDXLayoutRenderer } from '@/components/MDXComponents'
import PageTitle from '@/components/PageTitle'
import fs from 'fs'
import generateRss from '@/lib/generate-rss'

const DEFAULT_LAYOUT = 'PostSimple'

export async function getStaticPaths() {
  const metaPosts = await getAllMetaPosts()
  return {
    paths: metaPosts.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getAllPostsFrontMatter()
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getPost(SLUG_TYPES.BLOG, params.slug.join('/'))
  console.log('post', post)
  // const authorList = post.frontMatter.authors || ['default']
  // const authorPromise = authorList.map(async (author) => {
  //   const authorResults = await getFileBySlug('authors', [author])
  //   return authorResults.frontMatter
  // })
  // const authorDetails = await Promise.all(authorPromise)
  const authorDetails = await getFileBySlug('authors', ['default'])
  console.log('rss')
  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts)
    fs.writeFileSync('./public/feed.xml', rss)
  }

  return { props: { post, authorDetails, prev, next } }
}

export default function Blog({ post, authorDetails, prev, next }) {
  const { mdxSource, toc, frontMatter } = post

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          toc={toc}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
