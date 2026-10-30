import { createCookie } from "@remix-run/cookie";
import { getRequestEvent } from "@solidjs/web";

type Payload = {
  accessToken: string;
  refreshToken?: string;
  userId?: string;
};

const cookieInit = createCookie("app_name_auth_session", {
  httpOnly: true,
  secure: true,
  sameSite: "Strict",
});

export class AppCookieManager {
  private static GetEvent() {
    return getRequestEvent();
  }

  private static async AppendEvent(args: { payload: string; maxAge?: number }) {
    const { payload, maxAge = 1000 * 60 * 60 } = args;

    const cookie = await cookieInit.serialize(payload, { maxAge });
    const event = this.GetEvent();
    event?.response.headers.append("Set-Cookie", cookie);
    return cookie;
  }

  static async Save(payload: Payload) {
    return await this.AppendEvent({ payload: JSON.stringify(payload) });
  }

  static async Get() {
    const event = this.GetEvent();
    if (!event) return null;

    const cookieHeader = event.request.headers.get("cookie");
    if (!cookieHeader) return null;

    const cookie = await cookieInit.parse(cookieHeader);
    if (!cookie) return null;

    return JSON.parse(cookie) as Payload;
  }

  static async Clear() {
    return this.AppendEvent({ payload: "", maxAge: 0 });
  }
}
