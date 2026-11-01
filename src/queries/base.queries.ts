import { sdkClient } from "@libs/sdk";
import { redirect } from "@solidjs/web";
import { AppCookieManager } from "@utils/cookies";

export const BaseQueries = {
  getToken: async () => {
    const tokenPayload = await AppCookieManager.Get();
    if (!tokenPayload) throw redirect("/login");
    return tokenPayload.accessToken;
  },

  uploadMedia: async (args: { file: File; filename?: string }) => {
    const { file, filename } = args;
    const accessToken = await BaseQueries.getToken();
    return await sdkClient(accessToken).uploads.post({ file, filename });
  },

  getMedia: async (filename: string) => {
    const accessToken = await BaseQueries.getToken();

    const { data, error, status } = await sdkClient(accessToken).uploads.get(filename);
    if (error) return (error.message, { status: status });

    const blob = data as Blob;

    return new Response(data as Blob, {
      status: 200,
      headers: { "Content-Type": blob.type || "application/octet-stream" },
    });
  },
};
