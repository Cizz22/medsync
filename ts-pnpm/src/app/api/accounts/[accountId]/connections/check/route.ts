import { withAxiosContext } from "@/api-only/axios-context";
import { apiUrl } from "@/constant/env";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
    req: NextRequest,
) {
    return withAxiosContext(async (ctx) => {
        const body = await req.json
        const response = await ctx.axios.post("/connections/check", body);
        return response.data;
    }, req.headers.get("token"))(req);
}