import { withAxiosContext } from "@/api-only/axios-context";
import { apiUrl } from "@/constant/env";
import { NextRequest, NextResponse } from "next/server";


export async function POST(
    req: NextRequest,
) {
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.post("/connection/check", req.body);
        return response;
    }, req.headers.get("token"))(req);
}