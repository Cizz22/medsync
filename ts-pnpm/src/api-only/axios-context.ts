import axios, { AxiosInstance, HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

import { apiUrl } from "@/constant/env";

interface AxiosContext {
    axios: AxiosInstance;
}

type AxiosHandler<T = unknown> = (ctx: AxiosContext) => Promise<T>;

interface ErrorMessageResponse {
    message: string;
}

export function withAxiosContext<T = unknown>(
    handler: AxiosHandler<T>,
    accessToken?: string | null,
    isAuthenticated = true
): (req: NextRequest) => Promise<NextResponse<T | ErrorMessageResponse>> {
    return async (req) => {
        try {
            const axiosInstance = axios.create({
                baseURL: `${apiUrl}/v1`,
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
                }
            });

            if (isAuthenticated && !accessToken) {
                return NextResponse.json({
                    message: "Unauthenticate"
                }, {
                    status: HttpStatusCode.Unauthorized
                });
            }

            const response = await handler({ axios: axiosInstance });
            return NextResponse.json(response);
        } catch (err: any) {
            if (err.response) {
                return NextResponse.json({
                    message: err.response?.data
                }, {
                    status: err.response.status
                });
            } else {
                return NextResponse.json(
                    {
                        message: 'unknown error type',
                    },
                    {
                        status: 500,
                    }
                );
            }



        }
    };
}
