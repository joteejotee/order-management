import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'

export const metadata = {
  title: 'Laravel',
}

import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="font-sans text-gray-900 antialiased">
        <AuthCard
          logo={
            <Link href="/">
              <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
            </Link>
          }
        >
          {children}
        </AuthCard>
      </div>
    </div>
  )
}

export default Layout
