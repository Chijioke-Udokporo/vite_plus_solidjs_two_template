import { toast } from "@libs/toast";
import { createSignal } from "solid-js";
import { AuthQueries } from "@queries/auth.queries";
import { Button, Input } from "@components/ui";

export default function App() {
  const action = AuthQueries.Login;
  const [submitting, setSubmitting] = createSignal(false);

  action.onSubmit(() => setSubmitting(true));

  action.onSettled(({ result }) => {
    if (result?.error) toast.error(result?.error, { id: "error-login" });
    setTimeout(() => setSubmitting(false), 1500);
  });

  return (
    <div class="h-screen flex flex-col justify-center items-center gap-10">
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
