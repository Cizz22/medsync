
// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { Rubik } from 'next/font/google'
import { Chivo } from 'next/font/google'
import './styles.css'

const rubik = Rubik({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-rubik',
})
const chivo = Chivo({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-chivo',
})

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={rubik.variable + chivo.variable}>
                {children}
            </body>
        </html>
    )
}