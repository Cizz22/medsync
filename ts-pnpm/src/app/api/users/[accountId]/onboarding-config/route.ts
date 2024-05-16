import { NextRequest, NextResponse } from 'next/server';

import { withAxiosContext } from '@/api-only/axios-context';
import { RequestContext } from '@/shared';

export async function GET(
    req: NextRequest,
    { params }: RequestContext
): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
        const res = await ctx.axios.get(`/users/${params.accountId}/onboarding-config`)

        return res.data
    }, req.headers.get("token"))(req);
}

// export async function POST(req: NextRequest): Promise<NextResponse> {
//     const systemConfig = getSystemAppConfig();
//     return withNeosyncContext(async (ctx) => {
//         return ctx.client.users.setAccountOnboardingConfig(
//             SetAccountOnboardingConfigRequest.fromJson(await req.json())
//         );
//     })(req);
// }

// export async function PUT(req: NextRequest): Promise<NextResponse> {
//     const systemConfig = getSystemAppConfig();
//     return withNeosyncContext(async (ctx) => {
//         return ctx.client.users.setAccountOnboardingConfig(
//             SetAccountOnboardingConfigRequest.fromJson(await req.json())
//         );
//     })(req);
// }
