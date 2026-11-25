import { live } from "@solidjs/web/server-functions";
import { getRequestEvent } from "@solidjs/web";
import { sdkClient } from "@libs/sdk";
import { formAction } from "@solidjs/router";
import { createMemo, createSignal, For, Loading } from "solid-js";

const addTask = formAction(
  async (form: FormData) => {
    "use server";

    const value = form.get("title");
    const title = typeof value === "string" ? value.trim() : "";
    if (!title) return { error: "Enter a task title." };

    const { error } = await sdkClient().tasks.get();

    return { error: error?.message ?? null };
  },
  { name: "add-task" },
);

export const liveTasks = live(async () => {
  "use server";

  return sdkClient().tasks.watch({
    signal: getRequestEvent()?.request.signal,
    transport: "sse",
  });
});

export default function Tasks() {
  const tasks = createMemo(() => liveTasks());
  const [title, setTitle] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");

  addTask.onSubmit(() => {
    setSubmitting(true);
    setError("");
  });

  addTask.onSettled((submission) => {
    setSubmitting(false);
    if (submission.error) {
      setError("Could not add the task. Please try again.");
    } else if (submission.result?.error) {
      setError(submission.result.error);
    } else {
      setTitle("");
    }
  });

  return (
    <div class="mx-auto flex max-w-lg flex-col gap-4 p-6">
      <form method="post" action={addTask} class="flex gap-2">
        <input
          class="input input-bordered flex-1"
          name="title"
          aria-label="Task title"
          placeholder="Enter a task title"
          required
          value={title()}
          onInput={(event) => setTitle(event.currentTarget.value)}
          disabled={submitting()}
        />
        <button class="btn btn-primary" type="submit" disabled={submitting() || !title().trim()}>
          {submitting() ? "Adding…" : "Add task"}
        </button>
      </form>
      <p role="alert">{error()}</p>
      <Loading fallback={<p>Loading tasks…</p>}>
        <For each={tasks()} fallback={<p>No tasks yet.</p>}>
          {(task) => <div>{task.title}</div>}
        </For>
      </Loading>
    </div>
  );
}
