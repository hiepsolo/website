import Footer from './Footer'
import Image from './Image'
import Link from './Link'
import Logo from '@/data/logo.svg'
import MobileNav from './MobileNav'
import SectionContainer from './SectionContainer'
import ThemeSwitch from './ThemeSwitch'
import headerNavLinks from '@/data/headerNavLinks'
import siteMetadata from '@/data/siteMetadata'

const LayoutWrapper = ({ children }) => {
  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between border-b py-10">
          <div>
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 text-2xl font-semibold sm:block">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>
        <ShortInformation siteMetadata={siteMetadata} />
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

const ShortInformation = ({ siteMetadata }) => {
  return (
    <div className="my-16 flex flex-col gap-4 md:my-20 md:flex-row lg:my-24">
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
      <div className="prose flex flex-col gap-4 text-gray-500 dark:text-gray-400 lg:prose-xl">
        <h4 className="dark:text-gray-50">Hi 👋, I'm Hiep from Viet Nam 🇻🇳</h4>
        <div>I'm a full-stack software engineer</div>
        <div>
          I ❤️ solving user problems, building ideas to reality, and especially developing UI by
          Reactjs.
        </div>
        <div className="list-topics">
          Welcome to my personal blog, where I write about:
          <ul>
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

export default LayoutWrapper
