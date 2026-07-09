import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
  },
});

export function getPublicAssetUrl(assetPath: string) {
  const origin = baseURL.replace(/\/api$/, "");
  return `${origin}/${assetPath.replace(/^\//, "")}`;
}

export function getApiBaseUrl() {
  return baseURL;
}
