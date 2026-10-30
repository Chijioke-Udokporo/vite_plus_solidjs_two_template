import { createMemo } from "solid-js";
import { AppCookieManager } from "../utils/cookies";

const loader = async () => {
  "use server";

  const res = { message: "Greetings from server land 2" };
  await AppCookieManager.Save({ accessToken: "manty_is_good_token", refreshToken: "Hello Word" });

  return res;
};

export default function App() {
  const loaderData = createMemo(async () => loader());

  return (
    <div>
      <pre>{JSON.stringify(loaderData().message, null, 2)}</pre>
    </div>
  );
}
