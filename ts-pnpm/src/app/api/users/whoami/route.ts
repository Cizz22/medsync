import { NextRequest } from "next/server";

import {withAxiosContext} from "@/api-only/axios-context";

export async function GET(req: NextRequest){
    return withAxiosContext(async (ctx) => {
        const response = await ctx.axios.get("/users/me");
        return response.data;
    }, req.headers.get("token"))(req);
}