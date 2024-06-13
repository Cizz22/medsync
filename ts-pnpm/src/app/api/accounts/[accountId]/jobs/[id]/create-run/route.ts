import { NextRequest, NextResponse } from 'next/server';

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';


export async function POST(
    req: NextRequest,
    { params }: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const data = await req.json()
        const res = await ctx.axios.post(`/jobs/${params.id}/create-run`, data)
        return res.data
    }, req.headers.get("token"))(req)
}