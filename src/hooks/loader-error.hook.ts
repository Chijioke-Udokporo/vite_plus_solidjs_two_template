import { createEffect } from "solid-js";
import { toast } from "@libs/toast";

export function useErrorToast(
  loader: () => { error?: { message: string } | null } | null | undefined,
  id: string,
) {
  createEffect(
    () => loader()?.error,
    (error) => {
      if (error) toast.error(error.message, { id });
    },
  );
}
