import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(
    req: NextRequest,
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const body = await req.json()
        const response = await ctx.axios.get(`/transformers/user-defined/validate-code`, body)
        return response.data
    }, req.headers.get("token"))(req);
}