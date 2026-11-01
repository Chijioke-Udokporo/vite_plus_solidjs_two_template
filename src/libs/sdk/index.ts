import * as SDK from "./client";

export const sdkClient = (token?: string) => {
  return SDK.createCequreClient({
    baseUrl: process.env.SERVER_ORIGIN!,
    token,
    onResponse: () => {},
  });
};

export type { SDK };
