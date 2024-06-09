import { withAxiosContext } from "@/api-only/axios-context";
import { RequestContext } from '@/shared';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  req:NextRequest,
  {params}: RequestContext
): Promise<NextResponse> {
  return withAxiosContext(async (ctx) => {
      const transformer = await ctx.axios.get(`/transformers/user-defined/${params.id}`);
      return transformer.data;
  }, req.headers.get("token"))(req)
}

