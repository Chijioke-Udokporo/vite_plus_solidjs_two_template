import { sdkClient, type SDK } from "@libs/sdk";
import { AppCookieManager } from "@utils/cookies";
import { redirect } from "@solidjs/web";
import { formAction, query } from "@solidjs/router";
import { BaseQueries } from "./base.queries";

export const AuthQueries = {
  Me: query(async () => {
    "use server";
    const token = await BaseQueries.getToken();
    console.log("token", token);
    return await sdkClient(token).auth.me();
  }, "me"),

  Login: formAction(
    async (fd: FormData) => {
      "use server";

      const jsonData = Object.fromEntries(fd) as unknown as SDK.AuthLoginInput;
      const { data, error } = await sdkClient().auth.login(jsonData);
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
    { name: "login" },
  ),
};
