import { NextRequest, NextResponse } from "next/server";

import { withAxiosContext } from "@/api-only/axios-context";


export async function GET(
    req: NextRequest,
) {
    return withAxiosContext(async (ctx) => {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name') ?? '';
        const isAvailable = await ctx.axios.get('/connections/name-available',
            {
                params: {
                    name
                }
            }
        )

        return isAvailable.data
    }, req.headers.get("token"))(req);
}