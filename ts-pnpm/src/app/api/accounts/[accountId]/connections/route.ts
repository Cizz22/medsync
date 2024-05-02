import { NextRequest, NextResponse } from "next/server";

import {withAxiosContext} from "@/api-only/axios-context";
import { apiUrl } from "@/constant/env";
import { RequestContext } from "@/shared";

export async function GET(
    req: NextRequest,
) {
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.get("/connection");
        return response;
    }, req.headers.get("token"))(req);
}

export async function POST(
    req: NextRequest,
) {
    return withAxiosContext(async (ctx) => {
        const body = req.body;
        const response = await ctx.axios.post("/connection", body);
        return response;
    }, req.headers.get("token"))(req);
}