import { toast } from "@libs/toast";
import { createMemo } from "solid-js";
import { formAction } from "@solidjs/router";
import { sdkClient, type SDK } from "@libs/sdk";
import { AuthQueries } from "@queries/auth.queries";

const loader = async () => {
  "use server";

  const res = await sdkClient().health.get();
  return res.data;
};

const action = formAction(async (fd: FormData) => {
  "use server";

  const dd = Object.fromEntries(fd) as unknown as SDK.AuthLoginInput;
  return await AuthQueries.login(dd);
});

export default function App() {
  const loaderData = createMemo(() => loader());

  action.onSettled(({ result }) => {
    if (result?.error) toast.error(result?.error);
  });

  return (
    <div class="h-screen flex flex-col justify-center items-center gap-10">
      <pre>{JSON.stringify(loaderData(), null, 2)}</pre>

      <form method="post" action={action} class="flex flex-col gap-3 w-[20em] ">
        <input
          value="me@me.com"
          required
          type="email"
          name="email"
          autocomplete="username"
          placeholder="Enter email"
          class="input w-full bg-base-100"
        />
        <input
          value="wertyuiop"
          name="password"
          autocomplete="current-password"
          required
          type="password"
          placeholder="Enter password"
          class="input w-full"
        />
        <button class="btn btn-primary w-full">SUBMIT</button>
      </form>
    </div>
  );
}
