import type {ErrorObj} from '../types'

export class RequestError extends Error {
    code: number;
    constructor(error: string | ErrorObj, code?: number) {
      const message = typeof error === 'string' ? error : error.error.message;
      super(message)
      this.code = code || 500;
    }
  }
  
  export const fetcher = async <T>(
    url: string,
    {
      method = "POST",
      headers = {},
      body,
    }: {
      method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ) => {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });
  
    const data = await response.json();
  
    if(!response.ok) {
      throw new RequestError(data as ErrorObj, response.status);
    }

    return data as T;
  };