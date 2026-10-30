import type { Element as JSXElement } from "solid-js";
import { For } from "solid-js";
import { Portal } from "@solidjs/web";
import { toasts } from "./toast-store";
import { ToastItem } from "./ToastItem";
import type { ToasterProps, ToastPosition } from "./types";

function getPositionClasses(pos: ToastPosition = "top-right"): string {
  switch (pos) {
    case "top-left":
      return "top-4 left-4 items-start";
    case "top-center":
      return "top-4 left-1/2 -translate-x-1/2 items-center";
    case "top-right":
      return "top-4 right-4 items-end";
    case "bottom-left":
      return "bottom-4 left-4 items-start";
    case "bottom-center":
      return "bottom-4 left-1/2 -translate-x-1/2 items-center";
    case "bottom-right":
      return "bottom-4 right-4 items-end";
    default:
      return "top-4 right-4 items-end";
  }
}

export function Toaster(props: ToasterProps = {}): JSXElement {
  const position = () => props.position ?? "top-right";
  const items = () => {
    const list = toasts();
    if (props.maxToasts && props.maxToasts > 0) {
      return list.slice(-props.maxToasts);
    }
    return list;
  };

  return (
    <Portal>
      <div
        aria-label="Notifications"
        class={[
          "fixed z-50 pointer-events-none flex flex-col gap-2.5 w-full max-w-sm px-4 sm:px-0",
          getPositionClasses(position()),
          props.class,
        ]}
        role="region"
      >
        <For each={items()} keyed={(t) => t.id}>
          {(item) => <ToastItem position={position()} toast={item} />}
        </For>
      </div>
    </Portal>
  );
}
