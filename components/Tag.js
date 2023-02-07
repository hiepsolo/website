import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link
      href={`/tags/${kebabCase(text)}`}
      className="lg:text-md mr-3 text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
    >
      {'#' + text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
