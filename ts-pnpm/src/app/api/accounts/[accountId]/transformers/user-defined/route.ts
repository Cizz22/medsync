import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
    req: NextRequest,
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.get(`/transformers/user-defined`)
        return response.data
    }, req.headers.get("token"))(req);
}

export async function POST(
    req: NextRequest
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
      const body = await req.json()
      const response = await ctx.axios.post(
            '/transformers/user-defined', body
        )
        return response.data
    }, req.headers.get("token"))(req)
}