import { live } from "@solidjs/web/server-functions";
import { getRequestEvent } from "@solidjs/web";
import { sdkClient, type SDK } from "@libs/sdk";
import { formAction } from "@solidjs/router";
import { createMemo, createSignal, For, Loading } from "solid-js";

const addTask = formAction(
  async (form: FormData) => {
    "use server";

    const value = form.get("title");
    const title = typeof value === "string" ? value.trim() : "";
    if (!title) return { error: "Enter a task title." };

    const { error } = await sdkClient().tasks.post({
      title,
    });
    return { error: error?.message ?? null };
  },
  { name: "add-task" },
);

export const liveTasks = live(async function* () {
  "use server";

  const api = sdkClient();
  const signal = getRequestEvent()?.request.signal;
  let changed = true;
  let wake: (() => void) | undefined;
  let unsubscribe: (() => void) | undefined;

  const stop = () => {
    unsubscribe?.();
    wake?.();
  };

  signal?.addEventListener("abort", stop, { once: true });

  try {
    unsubscribe = await api.tasks.subscribeSSE(() => {
      changed = true;
      wake?.();
    });

    while (!signal?.aborted) {
      if (!changed) {
        await new Promise<void>((resolve) => {
          wake = resolve;
        });
        wake = undefined;
      }
      if (signal?.aborted) break;
      changed = false;

      // Each yield is a complete snapshot, including every page.
      const tasks: SDK.Tasks[] = [];
      let page = 1;
      while (!signal?.aborted) {
        const { data, error } = await api.tasks.get({
          query: { page, limit: 100, sort: "id" },
        });
        if (error) throw new Error(error.message);
        if (!data) throw new Error("Could not load tasks");
        tasks.push(...data.docs);
        if (!data.hasNextPage) break;
        page += 1;
      }

      if (!signal?.aborted) yield tasks;
    }
  } finally {
    signal?.removeEventListener("abort", stop);
    unsubscribe?.();
  }
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
