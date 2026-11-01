import { sdkClient, type SDK } from "@libs/sdk";
import { AppCookieManager } from "@utils/cookies";
import { redirect } from "@solidjs/web";

export const AuthQueries = {
  login: async (args: SDK.AuthLoginInput) => {
    const { data, error } = await sdkClient().auth.login(args);

    if (error) return { error: error.message };

    if (data?.user && data?.accessToken) {
      const serializedCookie = await AppCookieManager.Save({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        userId: data.user.id,
      });

      return redirect("/", {
        status: 303,
        headers: { "Set-Cookie": serializedCookie },
      });
    }
  },
};
