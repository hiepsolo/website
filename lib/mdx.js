import { getAllMetaPosts, getPost } from './airtable'

import { bundleMDX } from 'mdx-bundler'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCitation from 'rehype-citation'
import rehypeKatex from 'rehype-katex'
import rehypePresetMinify from 'rehype-preset-minify'
import rehypePrismPlus from 'rehype-prism-plus'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import remarkCodeTitles from './remark-code-title'
import remarkExtractFrontmatter from './remark-extract-frontmatter'
import remarkFootnotes from 'remark-footnotes'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkImgToJsx from './remark-img-to-jsx'
import remarkMath from 'remark-math'
import remarkTocHeadings from './remark-toc-headings'

const root = process.cwd()

// export function getFiles(type) {
//   const prefixPaths = path.join(root, 'data', type)
//   const files = getAllFilesRecursively(prefixPaths)
//   // Only want to return blog/path and ignore root, replace is needed to work on Windows
//   return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'))
// }

export function formatSlug(slug) {
  return slug.replace(/\.(mdx|md)/, '')
}

export function dateSortDesc(a, b) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

export async function getFileBySlug(type, slug) {
  console.log('getFileBySlug')
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  const source = fs.existsSync(mdxPath)
    ? fs.readFileSync(mdxPath, 'utf8')
    : fs.readFileSync(mdPath, 'utf8')
  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'esbuild.exe')
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild')
  }

  let toc = []

  const { code, frontmatter } = await bundleMDX({
    source,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, 'components'),
    xdmOptions(options, frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeTitles,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
        remarkImgToJsx,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
      ]
      return options
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      options.minify = false
      options.target = ['es2020', 'chrome58', 'firefox57', 'safari11', 'edge16', 'node12']
      options.platform = 'browser'
      return options
    },
  })

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  }
}

export async function getAllPostsFrontMatter() {
  const metaPosts = await getAllMetaPosts()

  const allFrontMatter = []

  metaPosts.forEach((post) => {
    const { data: frontmatter } = matter(post.Metadata)
    allFrontMatter.push({
      ...frontmatter,
      slug: formatSlug(post.Slug),
      date: frontmatter.PublishedDate ? new Date(frontmatter.PublishedDate).toISOString() : null,
    })
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}

export const SLUG_TYPES = {
  BLOG: 'blog',
  PROJECT: 'project',
}
/**
 * 2 types: blog, project
 */
export async function getBySlug(type, slug) {
  console.log('getBySlug')
  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'esbuild.exe')
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild')
  }

  let toc = []

  const post = await getPost(type, slug)
  console.log(`${post.Metadata}${post.Content}`)

  const { code, frontmatter } = await bundleMDX({
    source: `${post.Metadata}${post.Content}`,
    // mdx imports can be automatically source from the components directory
    cwd: path.join(root, 'components'),
    xdmOptions(options, frontmatter) {
      // this is the recommended way to add custom remark/rehype plugins:
      // The syntax might look weird, but it protects you in case we add/remove
      // plugins in the future.
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkCodeTitles,
        [remarkFootnotes, { inlineNotes: true }],
        remarkMath,
        remarkImgToJsx,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [rehypePrismPlus, { ignoreMissing: true }],
        rehypePresetMinify,
      ]
      return options
    },
    esbuildOptions: (options) => {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      options.minify = false
      options.target = ['es2020', 'chrome58', 'firefox57', 'safari11', 'edge16', 'node12']
      options.platform = 'browser'
      return options
    },
  })

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      ...frontmatter,
      date: post['Published Date'] ? new Date(post['Published Date']).toISOString() : null,
    },
  }
}
