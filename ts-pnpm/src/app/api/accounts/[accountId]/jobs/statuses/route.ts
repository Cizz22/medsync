import { NextRequest, NextResponse } from 'next/server';

import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';


export async function GET(
    req: NextRequest,
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const statuses = ctx.axios.get('/jobs/statuses')
        return (await statuses).data
    }, req.headers.get("token"))(req)
}
