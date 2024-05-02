import axios, { AxiosInstance } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/constant/env";

interface AxiosContext {
    axios:AxiosInstance;
}

type AxiosHandler<T = unknown> = (ctx: AxiosContext) => Promise<T>;

interface ErrorMessageResponse {
    message: string;
}


export function withAxiosContext<T = unknown>(
    handler: AxiosHandler<T>,
    accessToken: string | null
): (req: NextRequest) => Promise<NextResponse<T | ErrorMessageResponse>>{
    return async (req) => {
        if(!accessToken){
            return NextResponse.json({
                message: "Unauthorized"
            });
        }
        
        try{
            const axiosInstance = axios.create({
                baseURL: `${apiUrl}/v1`,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            const response = await handler({ axios: axiosInstance });
            return NextResponse.json(response);
        }catch(err:any){
            return NextResponse.json({
                message: err.message
            });
        }
    }
}

