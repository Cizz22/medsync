import { NextRequest, NextResponse } from "next/server";

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from "@/shared";

export async function GET(
    req:NextRequest,
    {params}: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const connection = await ctx.axios.get(`/connection/${params.id}`);

        return connection;
    }, req.headers.get("token"))(req)
}

export async function DELETE(
    req:NextRequest,
    {params}: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        await ctx.axios.delete(`/connection/${params.id}`);
    }, req.headers.get("token"))(req)
}