import { NextRequest, NextResponse } from "next/server";

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from "@/shared";

export async function GET(
    req:NextRequest,
    {params}: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const connection = await ctx.axios.get(`/connections/${params.id}`);
        return connection.data;
    }, req.headers.get("token"))(req)
}

export async function DELETE(
    req:NextRequest,
    {params}: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        await ctx.axios.delete(`/connections/${params.id}`);
    }, req.headers.get("token"))(req)
}


export async function PUT(
    req:NextRequest,
    {params}: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const data = await req.json()
        const newConnection = await ctx.axios.put(`connections/${params.id}`, data)

        return newConnection.data
    }, req.headers.get("token"))(req)
}
