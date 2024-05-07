import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
    req: NextRequest,
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.get(`/jobs`)
        return response.data
    }, req.headers.get("token"))(req);
}

export async function POST(
    req: NextRequest
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.post(
            '/jobs', req.body
        )

        return response.data
    }, req.headers.get("token"))(req)
}