'use client'
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/y8H0Ty82DQ7
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { getErrorMessage } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function Component() {
    const router = useRouter()
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    const { toast } = useToast()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setCredentials((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            setIsLoading(true)
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            })

            if (!res.ok) {
                const body = await res.json();
                throw new Error(body.message.message);
            }

            toast({
                title: 'Successfully created new user!',
            });
            setIsLoading(false)
            router.push("/login")
        } catch (err) {
            setIsLoading(false)
            toast({
                title: 'Unable to create new user',
                description: getErrorMessage(err),
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
            <div className="mx-auto w-full max-w-md space-y-6">
                <div className="flex flex-col items-center space-y-2">
                    <FolderSyncIcon className="h-12 w-12 text-gray-900 dark:text-gray-50" />
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">MedSync</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" onChange={handleChange} placeholder="Name" type="text" value={credentials.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" onChange={handleChange} placeholder="name@example.com" type="email" value={credentials.email} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input id="password" name="password" onChange={handleChange} placeholder="••••••••" type="password" value={credentials.password} />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <Button className="flex-1" type="submit" disabled={isLoading ? true : false}>
                                Sign up
                            </Button>
                            <Link
                                className="inline-flex flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                                href="/login"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

function FolderSyncIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1" />
            <path d="M12 10v4h4" />
            <path d="m12 14 1.5-1.5c.9-.9 2.2-1.5 3.5-1.5s2.6.6 3.5 1.5c.4.4.8 1 1 1.5" />
            <path d="M22 22v-4h-4" />
            <path d="m22 18-1.5 1.5c-.9.9-2.1 1.5-3.5 1.5s-2.6-.6-3.5-1.5c-.4-.4-.8-1-1-1.5" />
        </svg>
    )
}

// === styles.css ===

// body {
//   font-family: var(--font-inter), sans-serif;
// }

// h1, h2, h3, h4, h5, h6 {
//   font-family: var(--font-inter), sans-serif;
// }

// === layout.jsx ===

// // This is the root layout component for your Next.js app.
// // Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

// import { Inter } from 'next/font/google'
// import './styles.css'

// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-inter',
// })

// export default function Layout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.variable}>
//         {children}
//       </body>
//     </html>
//   )
// }