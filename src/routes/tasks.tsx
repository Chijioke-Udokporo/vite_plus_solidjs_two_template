import { GET, live, serverFunctionUrl } from "@solidjs/web/server-functions";
import { getRequestEvent } from "@solidjs/web";
import { sdkClient } from "@libs/sdk";
import { formAction } from "@solidjs/router";
import { createMemo, createSignal, For, Loading, Show } from "solid-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const addTask = formAction(
  async (form: FormData) => {
    "use server";

    const value = form.get("title");
    const title = typeof value === "string" ? value.trim() : "";
    if (!title) return { error: "Enter a task title." };
    const { error } = await sdkClient().blogs.get();
    return { error: error?.message ?? null };
  },
  { name: "add-task" },
);

export const liveTasks = live(async () => {
  "use server";

  return sdkClient().blogs.watch({
    query: { sort: "-createdAt", limit: 5 },
    signal: getRequestEvent()?.request.signal,
    transport: "sse",
  });
});

export const imagesUrl = GET(async (filename: string) => {
  "use server";
  const { data } = await sdkClient().uploads.get(filename);
  return data || "";
});

export default function Tasks() {
  const allTasks = createMemo(() => liveTasks());

  const [title, setTitle] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");

  addTask.onSubmit(() => {
    setSubmitting(true);
    setError("");
  });

  addTask.onSettled((submission) => {
    setSubmitting(false);
    if (submission.error) setError("Could not add the task. Please try again.");
    else if (submission.result?.error) setError(submission.result.error);
    else setTitle("");
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

      <Show when={error()}>
        <p role="alert">{error()}</p>
      </Show>

      <Loading fallback={<p>Loading tasks…</p>}>
        <For each={allTasks()?.docs} fallback={<p>No tasks yet.</p>}>
          {(task) => (
            <div class="flex flex-col border-b py-2 gap-4">
              <div>
                <p class=" text-xs text-base-content/50">{dayjs(task?.createdAt).fromNow()}</p>
                <p class="font-bold text-xxl">{task.title}</p>
              </div>
              <Show when={task.image.filename}>
                {(filename) => <img src={serverFunctionUrl(imagesUrl, filename())} />}
              </Show>

              <p class="text-sm text-base-content/80">{task.description}</p>
            </div>
          )}
        </For>
      </Loading>
    </div>
  );
}
