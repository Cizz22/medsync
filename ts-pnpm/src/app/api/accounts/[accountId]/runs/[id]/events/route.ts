import { NextRequest, NextResponse } from "next/server";

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from "@/shared";

export async function GET(
    req:NextRequest,
    {params}: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const run = await ctx.axios.get(`/runs/${params.id}/events`);
        return run.data;
    }, req.headers.get("token"))(req)
}