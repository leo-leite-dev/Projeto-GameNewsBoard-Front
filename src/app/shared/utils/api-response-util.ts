import { ApiResponse } from "../models/commons/api-response.model";

export function validateApiResponse<T>(response: ApiResponse<T>, action: string): ApiResponse<T> {
    if (!response.success) {
        throw new Error(response.message || `Erro ao ${action}.`);
    }
    return response;
}