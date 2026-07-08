import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api";

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
