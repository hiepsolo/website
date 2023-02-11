import Image from 'next/image'
import Link from 'next/link'
import Tag from './Tag'
import formatDate from '@/lib/utils/formatDate'

export default function PostItem({ slug, date, title, summary, tags, image = {} }) {
  const { src, alt } = image
  return (
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
          {src && (
            <Image
              src={src}
              width={160}
              height={160}
              quality={75}
              alt={alt}
              className="h-14 w-20 sm:h-40 sm:w-40"
            />
          )}
        </div>
      </div>
      <div className="mt-4 text-base font-medium  leading-6 md:mt-6 xl:mt-8">
        <div className="flex flex-wrap">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
      </div>
    </article>
  )
}
