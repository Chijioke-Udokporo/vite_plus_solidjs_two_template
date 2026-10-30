import type { Element } from "solid-js";
import { Show } from "solid-js";
import { toast } from "./toast-store";
import type { Toast, ToastPosition } from "./types";

function ToastIcon(props: { type: Toast["type"] }): Element {
  return (
    <Show when={props.type !== "loading"} fallback={<span class="loading loading-spinner loading-sm shrink-0" />}>
      <Show when={props.type === "success"}>
        <svg
          class="size-5 shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </Show>
      <Show when={props.type === "error"}>
        <svg
          class="size-5 shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" x2="9" y1="9" y2="15" />
          <line x1="9" x2="15" y1="9" y2="15" />
        </svg>
      </Show>
      <Show when={props.type === "warning"}>
        <svg
          class="size-5 shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
      </Show>
      <Show when={props.type === "info"}>
        <svg
          class="size-5 shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="16" y2="12" />
          <line x1="12" x2="12.01" y1="8" y2="8" />
        </svg>
      </Show>
      <Show when={props.type === "default"}>
        <svg
          class="size-5 shrink-0"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </Show>
    </Show>
  );
}

function getAlertClass(type: Toast["type"]): string {
  switch (type) {
    case "success":
      return "alert-success";
    case "error":
      return "alert-error";
    case "warning":
      return "alert-warning";
    case "info":
      return "alert-info";
    default:
      return "alert-neutral bg-base-100 text-base-content border border-base-300";
  }
}

function getSlideAnimationClass(position: ToastPosition = "top-right", isDismissing: boolean = false): string {
  if (position === "top-left" || position === "bottom-left") {
    return isDismissing ? "animate-toast-slide-out-left" : "animate-toast-slide-in-left";
  }
  if (position === "top-center") {
    return isDismissing ? "animate-toast-slide-out-top" : "animate-toast-slide-in-top";
  }
  if (position === "bottom-center") {
    return isDismissing ? "animate-toast-slide-out-bottom" : "animate-toast-slide-in-bottom";
  }
  return isDismissing ? "animate-toast-slide-out-right" : "animate-toast-slide-in-right";
}

export function ToastItem(props: { toast: Toast | (() => Toast); position?: ToastPosition }): Element {
  const currentToast = () => (typeof props.toast === "function" ? props.toast() : props.toast);

  const isAssertive = () => currentToast().type === "error";
  const animationClass = () => getSlideAnimationClass(props.position, currentToast().isDismissing);

  return (
    <div
      aria-atomic="true"
      aria-live={isAssertive() ? "assertive" : "polite"}
      class={[
        "alert shadow-lg pointer-events-auto flex items-start sm:items-center justify-between gap-3 text-sm py-3 px-4 rounded-xl",
        "transition-all duration-200 ease-out hover:scale-[1.01] hover:shadow-xl",
        animationClass(),
        getAlertClass(currentToast().type),
      ]}
      data-toast-dismissing={currentToast().isDismissing ? "true" : undefined}
      data-toast-id={currentToast().id}
      data-toast-type={currentToast().type}
      onMouseEnter={() => toast.pause(currentToast().id)}
      onMouseLeave={() => toast.resume(currentToast().id)}
      role={isAssertive() ? "alert" : "status"}
    >
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <ToastIcon type={currentToast().type} />
        <div class="flex flex-col min-w-0">
          <div class="font-medium leading-snug wrap-break-word">{currentToast().title}</div>
          <Show when={currentToast().description}>
            <div class="text-xs opacity-80 mt-0.5 leading-normal wrap-break-word">{currentToast().description}</div>
          </Show>
        </div>
      </div>

      <div class="flex items-center gap-1.5 shrink-0 self-center">
        <Show when={currentToast().action}>
          {(action) => (
            <button
              class="btn btn-xs btn-outline rounded-md font-medium"
              onClick={() => action().onClick(currentToast())}
              type="button"
            >
              {action().label}
            </button>
          )}
        </Show>

        <Show when={currentToast().dismissible}>
          <button
            aria-label="Close notification"
            class="btn btn-ghost btn-xs btn-circle opacity-70 hover:opacity-100 hover:bg-black/10 transition-colors"
            onClick={() => toast.dismiss(currentToast().id)}
            type="button"
          >
            ✕
          </button>
        </Show>
      </div>
    </div>
  );
}
