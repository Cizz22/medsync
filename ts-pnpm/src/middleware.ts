export { auth as middleware } from "./app/api/auth/[...nextauth]/auth"

export const config = {
    matcher: [
        "/dashboard"
    ]
}

