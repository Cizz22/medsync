/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Gf34GXnYwsW
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
export default function Login() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white px-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Dont have an account?
                        <a className="font-medium text-indigo-600 hover:underline" href="#">
                            Sign up
                        </a>
                    </p>
                </div>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                autoComplete="email"
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                id="email"
                                name="email"
                                placeholder="you@example.com"
                                required
                                type="email"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                autoComplete="current-password"
                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                id="password"
                                name="password"
                                placeholder="Password"
                                required
                                type="password"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            type="submit"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// === styles.css ===

// body {
//   font-family: var(--font-chivo), sans-serif;
// }

// h1, h2, h3, h4, h5, h6 {
//   font-family: var(--font-rubik), sans-serif;
// }

