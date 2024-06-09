// import { withNeosyncContext } from '@/api-only/neosync-context';
// import { GetSystemTransformersRequest } from '@neosync/sdk';
import { withAxiosContext } from '@/api-only/axios-context';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest): Promise<NextResponse> {
  return withAxiosContext(async (ctx) => {
    const transformers = ctx.axios.get('/transformers/system')
    return (await transformers).data
}, req.headers.get("token"))(req)
  

}
