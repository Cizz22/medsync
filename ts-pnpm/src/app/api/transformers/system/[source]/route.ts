import { withAxiosContext } from '@/api-only/axios-context';
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';


  export async function GET(req: NextRequest,
    { params }: RequestContext): Promise<NextResponse> {
    return withAxiosContext(async (ctx) => {
      const source = parseInt(params.source ?? '', 10);
      const transformer = ctx.axios.get(`/transformers/system/${source}`)
      return (await transformer).data
  }, req.headers.get("token"))(req)
}
