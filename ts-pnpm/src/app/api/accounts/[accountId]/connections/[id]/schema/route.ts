import { withAxiosContext } from "@/api-only/axios-context";

import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/shared";

export async function GET(
    req:NextRequest,
    {params}: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const connectionSchema = await ctx.axios.get(`/connection/${params.id}/schema`);
        return connectionSchema;
    }, req.headers.get("token"))(req)
}