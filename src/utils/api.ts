/**
 * Utility functions for API requests and data fetching
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Handles API response and throws appropriate errors
 * @param response The fetch Response object
 * @returns The parsed response data
 */
async function handleResponse<T>(response: Response): Promise<T> {
  let data: any;
  try {
    // Try to parse as JSON first
    data = await response.json();
  } catch (error) {
    // If not JSON, get text content
    data = await response.text();
  }

  if (!response.ok) {
    throw new ApiError(
      data.message || response.statusText || 'API request failed',
      response.status,
      data
    );
  }

  return data as T;
}

/**
 * Makes a GET request to the specified URL
 * @param url The URL to fetch from
 * @param options Additional fetch options
 * @returns The parsed response data
 */
export async function get<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Makes a POST request to the specified URL
 * @param url The URL to fetch from
 * @param data The data to send in the request body
 * @param options Additional fetch options
 * @returns The parsed response data
 */
export async function post<T>(
  url: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Makes a PUT request to the specified URL
 * @param url The URL to fetch from
 * @param data The data to send in the request body
 * @param options Additional fetch options
 * @returns The parsed response data
 */
export async function put<T>(
  url: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Makes a PATCH request to the specified URL
 * @param url The URL to fetch from
 * @param data The data to send in the request body
 * @param options Additional fetch options
 * @returns The parsed response data
 */
export async function patch<T>(
  url: string,
  data: any,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Makes a DELETE request to the specified URL
 * @param url The URL to fetch from
 * @param options Additional fetch options
 * @returns The parsed response data
 */
export async function del<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Uploads a file to the specified URL
 * @param url The URL to upload to
 * @param file The file to upload
 * @param fieldName The name of the form field (default: 'file')
 * @param additionalData Additional form data to include
 * @param options Additional fetch options
 * @returns The parsed response data
 */
export async function uploadFile<T>(
  url: string,
  file: File,
  fieldName: string = 'file',
  additionalData: Record<string, any> = {},
  options: RequestInit = {}
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  // Add any additional data to the form
  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * Retries a function multiple times with exponential backoff
 * @param fn The async function to retry
 * @param maxRetries Maximum number of retries (default: 3)
 * @param baseDelay Base delay in milliseconds (default: 300)
 * @returns The result of the function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 300
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Don't retry if we've reached max retries
      if (attempt === maxRetries) break;

      // Don't retry for certain status codes
      if (error instanceof ApiError && [400, 401, 403, 404].includes(error.status)) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}