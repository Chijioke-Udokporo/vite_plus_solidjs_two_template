import { createMemo } from "solid-js";

export default function App() {
  const loaderData = createMemo(() => AuthQueries.Me());
  useErrorToast(loaderData, "me-error");

  return (
    <div class="h-screen flex flex-col justify-center items-center gap-10">
      <pre>{JSON.stringify(loaderData()?.data, null, 2)}</pre>
    </div>
  );
}
