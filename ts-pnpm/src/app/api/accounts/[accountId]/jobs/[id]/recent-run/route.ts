import { NextRequest, NextResponse } from 'next/server';

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';

export async function GET(
    req:NextRequest,
    {params}:RequestContext
):Promise<NextResponse>{
    return withAxiosContext(async (ctx) => {
        const res = ctx.axios.get(`/jobs/${params.id}/recent-run`)
        return (await res).data
    },req.headers.get("token"))(req)
}

