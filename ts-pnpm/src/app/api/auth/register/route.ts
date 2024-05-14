import { NextRequest } from "next/server";

import { withAxiosContext } from "@/api-only/axios-context";

export async function POST(
    req: NextRequest
) {
    return withAxiosContext(async (ctx) => {
        const data = await req.json()
        const response = await ctx.axios.post('/auth/register', data)
        return response.data
    }, null, false)(req)
}