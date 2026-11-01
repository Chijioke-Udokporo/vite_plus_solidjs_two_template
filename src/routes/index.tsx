import { createMemo } from "solid-js";
import { sdkClient } from "@libs/sdk";

const loader = async () => {
  "use server";

  const res = await sdkClient().health.get();
  return res.data;
};

export default function App() {
  const loaderData = createMemo(() => loader());

  return (
    <div>
      <pre>{JSON.stringify(loaderData(), null, 2)}</pre>
    </div>
  );
}
