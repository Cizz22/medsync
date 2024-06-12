import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
    req: NextRequest,
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('jobId') ?? '';
        const response = await ctx.axios.get(`/runs`,{
            params:{
                jobId
            }
        })
        return response.data
    }, req.headers.get("token"))(req);
}
