import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(
  req: NextRequest,
): Promise<NextResponse> {
  return withAxiosContext(async (ctx) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('transformerName') ?? '';
    const isAvailable = await ctx.axios.get('/transformers/is-name-available',
        {
            params: {
                name
            }
        }
    )

    return isAvailable.data
}, req.headers.get("token"))(req);
}
