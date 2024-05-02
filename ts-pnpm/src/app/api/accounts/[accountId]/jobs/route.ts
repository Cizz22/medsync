import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
    req: NextRequest,
    {params}: RequestContext
): Promise<NextResponse>{
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.get(`/job`)
        return response
    }, req.headers.get("token"))(req);
}

export 