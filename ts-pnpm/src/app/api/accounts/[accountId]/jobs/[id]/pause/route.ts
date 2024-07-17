import { NextRequest, NextResponse } from 'next/server';

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';


export async function GET(
    req:NextRequest,
    {params}:RequestContext
):Promise<NextResponse>{
    return withAxiosContext(async (ctx) => {
        const { searchParams } = new URL(req.url);
        const is_pause = searchParams.get('is_pause') ?? '';
        const res = await ctx.axios.get(`/jobs/${params.id}/pause`,
            {
                params: {
                    is_pause
                }
            }
        )

        return res.data
    },req.headers.get("token"))(req)
}