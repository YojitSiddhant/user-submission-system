type QueryParams = Record<string, string | number | boolean | undefined | null>;

type RequestConfig = {
  baseURL?: string;
  headers?: Record<string, string>;
};

type FetchConfig = RequestInit & {
  params?: QueryParams;
};

type AxiosResponse<T = unknown> = {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
};

type AxiosError = Error & {
  response?: AxiosResponse;
};

function buildUrl(baseURL: string | undefined, url: string, params?: QueryParams) {
  const resolvedUrl = /^https?:\/\//i.test(url)
    ? url
    : baseURL
      ? `${baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`
      : url;
  const finalUrl = new URL(resolvedUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        finalUrl.searchParams.set(key, String(value));
      }
    });
  }

  return finalUrl.toString();
}

async function request<T>(
  config: RequestConfig,
  url: string,
  fetchConfig: FetchConfig = {},
) {
  const response = await fetch(buildUrl(config.baseURL, url, fetchConfig.params), {
    ...fetchConfig,
    headers: {
      ...(config.headers || {}),
      ...(fetchConfig.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error("Request failed") as AxiosError;
    error.response = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
    throw error;
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  } as AxiosResponse<T>;
}

function create(config: RequestConfig = {}) {
  return {
    get<T>(url: string, fetchConfig: FetchConfig = {}) {
      return request<T>(config, url, { ...fetchConfig, method: "GET" });
    },
    post<T>(url: string, body?: BodyInit | null, fetchConfig: FetchConfig = {}) {
      return request<T>(config, url, { ...fetchConfig, method: "POST", body });
    },
    delete<T>(url: string, fetchConfig: FetchConfig = {}) {
      return request<T>(config, url, { ...fetchConfig, method: "DELETE" });
    },
  };
}

const axios = {
  create,
};

export type { AxiosError, AxiosResponse };
export default axios;
