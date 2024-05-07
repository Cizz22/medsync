import { NextRequest, NextResponse } from "next/server";

import {withAxiosContext} from "@/api-only/axios-context";


export async function GET(
    req: NextRequest,
) {
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.get("/connections");
        return response.data;
    }, req.headers.get("token"))(req);
}

export async function POST(
    req: NextRequest,
) {
    return withAxiosContext(async (ctx) => {
        const body = req.body;
        const response = await ctx.axios.post("/connections", body);
        return response.data;
    }, req.headers.get("token"))(req);
}