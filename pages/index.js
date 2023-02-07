import Image from '@/components/Image'
import Link from '@/components/Link'
import NewsletterForm from '@/components/NewsletterForm'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import formatDate from '@/lib/utils/formatDate'
import { getAllFilesFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllFilesFrontMatter('blog')

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
            return (
              <li key={slug} className="py-12">
                <article>
                  <dl className="mb-2">
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date)}</time>
                    </dd>
                  </dl>
                  <div className="grid grid-cols-4 items-start gap-2 space-y-2 xl:space-y-0">
                    <div className="col-span-3 space-y-6">
                      <Link href={`/blog/${slug}`}>
                        <h2 className="text-base font-bold leading-8 tracking-tight text-gray-900 line-clamp-2 dark:text-gray-100 md:text-xl lg:text-2xl">
                          {title}
                        </h2>
                      </Link>
                      <Link href={`/blog/${slug}`} className="hidden sm:block">
                        <div className="prose mt-6 max-w-none text-gray-600 line-clamp-3 dark:text-gray-400">
                          {summary}
                        </div>
                      </Link>
                    </div>
                    <div className="flex justify-end">
                      {siteMetadata.image && (
                        <Image
                          src={siteMetadata.image}
                          width={160}
                          height={160}
                          quality={75}
                          alt="avatar"
                          className="h-14 w-20 sm:h-40 sm:w-40"
                        />
                      )}
                    </div>
                  </div>
                  <div className="text-base font-medium leading-6">
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
