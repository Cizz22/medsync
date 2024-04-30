/**
 * v0 by Vercel.
 * @see https://v0.dev/t/8Bcpiv66s1B
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card,CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select,SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table,TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-950 dark:text-gray-50">
      <header className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-2 text-lg font-semibold" href="#">
            <MountainIcon className="w-6 h-6" />
            <span className="sr-only">Acme Dashboard</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <Link className="hover:underline underline-offset-4" href="#">
              Overview
            </Link>
            <Link className="hover:underline underline-offset-4" href="#">
              Analytics
            </Link>
            <Link className="hover:underline underline-offset-4" href="#">
              Customers
            </Link>
            <Link className="hover:underline underline-offset-4" href="#">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Button className="rounded-full" size="icon" variant="outline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Avatar"
              className="rounded-full"
              height="32"
              src="/placeholder.svg"
              style={{
                aspectRatio: "32/32",
                objectFit: "cover",
              }}
              width="32"
            />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </div>
      </header>
      <main className="flex-1 p-6 md:p-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSignIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <UsersIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <CreditCardIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <ActivityIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 md:mt-10">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>$250.00</TableCell>
                  <TableCell className="text-right">Credit Card</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV002</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>$150.00</TableCell>
                  <TableCell className="text-right">PayPal</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV003</TableCell>
                  <TableCell>Unpaid</TableCell>
                  <TableCell>$350.00</TableCell>
                  <TableCell className="text-right">Bank Transfer</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV004</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>$450.00</TableCell>
                  <TableCell className="text-right">Credit Card</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV005</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>$550.00</TableCell>
                  <TableCell className="text-right">PayPal</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </div>
      </main>
    </div>
  )
}

function ActivityIcon(props:any) {
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
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}


function CreditCardIcon(props:any) {
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
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}


function DollarSignIcon(props:any) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}


function MountainIcon(props:any) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function UsersIcon(props:any) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

// === styles.css ===

// body {
//   font-family: var(--font-rubik), sans-serif;
// }

// h1, h2, h3, h4, h5, h6 {
//   font-family: var(--font-libre_franklin), sans-serif;
// }

// === layout.jsx ===

// // This is the root layout component for your Next.js app.
// // Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

// import { Libre_Franklin } from 'next/font/google'
// import { Rubik } from 'next/font/google'
// import './styles.css'

// const libre_franklin = Libre_Franklin({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-libre_franklin',
// })
// const rubik = Rubik({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-rubik',
// })

// export default function Layout({ children }) {
//   return (
//     <html lang="en">
//       <body className={libre_franklin.variable + rubik.variable}>
//         {children}
//       </body>
//     </html>
//   )
// }