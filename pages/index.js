import Image from '@/components/Image'
import Link from '@/components/Link'
import NewsletterForm from '@/components/NewsletterForm'
import { PageSEO } from '@/components/SEO'
import PostItem from '@/components/PostItem'
import { getAllPostsFrontMatter } from '@/lib/mdx'
import siteMetadata from '@/data/siteMetadata'

const MAX_DISPLAY = 5

export async function getStaticProps() {
  const posts = await getAllPostsFrontMatter()

  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ShortInformation siteMetadata={siteMetadata} />
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug } = frontMatter
            return (
              <li key={slug} className="lg:12 py-8 md:py-10">
                <PostItem {...frontMatter} />
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
const ShortInformation = ({ siteMetadata }) => {
  return (
    <div className="mb-12 flex flex-col gap-4 md:mb-16 md:flex-row lg:mb-20">
      {siteMetadata.image && (
        <Image
          src={siteMetadata.image}
          width={128}
          height={128}
          quality={75}
          alt="avatar"
          className="h-32 w-32 rounded-full border border-gray-100 border-opacity-80"
        />
      )}
      <div className="prose flex flex-col gap-4 text-gray-500 lg:prose-xl dark:text-gray-400">
        <h4 className="dark:text-gray-50">Hi 👋, I'm Hiep from Viet Nam 🇻🇳</h4>
        <div>I'm a full-stack software engineer</div>
        <div>
          I ❤️ solving user problems, building ideas to reality, and especially developing UI by
          Reactjs.
        </div>
        <div className="list-topics">
          Welcome to my personal blog, where I write about:
          <ul className="border-l border-gray-200">
            <li>
              <span>🔥</span> Self-development
            </li>
            <li>
              <span>🦄</span> Startup
            </li>
            <li>
              <span>🤖</span> AI
            </li>
            <li>
              <span>🕊️</span> Journey to reach financial freedom
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
