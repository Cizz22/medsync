import { NextRequest, NextResponse } from "next/server";

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from "@/shared";

export async function GET(
    req:NextRequest,
    {params}: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const { searchParams } = new URL(req.url);
        const logLevel = searchParams.get('loglevel') ?? '';
        const run = await ctx.axios.get(`/runs/${params.id}/logs?logLevel=${logLevel}`);
        return run.data;
    }, req.headers.get("token"))(req)
}