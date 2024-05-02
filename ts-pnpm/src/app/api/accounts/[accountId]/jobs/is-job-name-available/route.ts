import { NextRequest, NextResponse } from 'next/server';

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';


export async function GET(
    req: NextRequest
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const { searchParams } = new URL(req.url);
        const name = searchParams.get('name') ?? '';
        const isAvailable = await ctx.axios.get('/job/name-available',
            {
                params: {
                    name
                }
            }
        )

        return isAvailable.data
    }, req.headers.get("token"))(req)
}