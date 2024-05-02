import { NextRequest, NextResponse } from "next/server";

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from "@/shared";

export async function GET(
    req: NextRequest,
    { params }: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.get(`/connection/${params.id}/constrains/primary`)
        return response.data
    }, req.headers.get('token'))(req)
}