import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
    req: NextRequest,
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.get(`/transformers/user-defined/validate-regex`)
        return response.data
    }, req.headers.get("token"))(req);
}