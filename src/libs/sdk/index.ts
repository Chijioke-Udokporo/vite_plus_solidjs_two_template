import * as SDK from "./client";

export const sdkClient = (token?: string) => {
  return SDK.createCequreClient({
    baseUrl: process.env.SERVER_ORIGIN!,
    token,
    onResponse: () => {},
  });
};

export const sdkWsClient = (token: string) => {
  return SDK.createCequreRealtimeClient({
    baseUrl: process.env.SERVER_ORIGIN!,
    token,
    onResponse: ({ url }) => {
      console.log(url);
    },
  });
};

export type { SDK };
