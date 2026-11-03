import { toast } from "@libs/toast";
import { createMemo, createSignal } from "solid-js";
import { formAction, query } from "@solidjs/router";
import { sdkClient, type SDK } from "@libs/sdk";
import { AuthQueries } from "@queries/auth.queries";
import { respond } from "@solidjs/web";
import { Button, Input } from "@components/ui";

const loader = query(async () => {
  "use server";

  const res = await sdkClient().health.get();
  return res.data;
}, "health");

const action = formAction(async (fd: FormData) => {
  "use server";

  const dd = Object.fromEntries(fd) as unknown as SDK.AuthLoginInput;
  const result = await AuthQueries.login(dd);
  return respond(result, { revalidate: ["health"] });
});

export default function App() {
  const loaderData = createMemo(() => loader());
  const [submitting, setSubmitting] = createSignal(false);

  action.onSubmit(() => setSubmitting(true));

  action.onSettled(({ result }) => {
    if (result?.error) toast.error(result?.error, { id: "error-login" });
    setTimeout(() => setSubmitting(false), 1500);
  });

  return (
    <div class="h-screen flex flex-col justify-center items-center gap-10">
      <pre>{JSON.stringify(loaderData()?.timestamp, null, 2)}</pre>

      <form method="post" action={action} class="flex flex-col gap-3 w-[20em] ">
        <Input
          icon="solar:letter-linear"
          title="email"
          value="me@me.com"
          required
          type="email"
          name="email"
          autocomplete="username"
          placeholder="Enter email"
          class="input w-full bg-base-100"
        />

        <Input
          icon="solar:lock-password-linear"
          title="password"
          value="wertyuiop"
          name="password"
          autocomplete="current-password"
          required
          type="password"
          placeholder="Enter password"
          class="input w-full"
        />
        <Button title="Submit" isSubmitting={submitting} class="btn btn-primary w-full" />
      </form>
    </div>
  );
}
