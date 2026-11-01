import type { Element } from "solid-js";
import { Show, createSignal } from "solid-js";
import { toast } from "./toast-store";
import type { Toast, ToastAnimationOptions, ToastPosition } from "./types";

function ToastIcon(props: { type: Toast["type"] }): Element {
  return (
    <div class="animate-toast-icon-pop flex items-center justify-center shrink-0">
      <Show
        when={props.type !== "loading"}
        fallback={<span class="loading loading-spinner loading-sm shrink-0" />}
      >
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
    </div>
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

function getSlideAnimationClass(
  position: ToastPosition = "top-right",
  isDismissing: boolean = false,
  customAnimation?: ToastAnimationOptions,
): string {
  if (customAnimation) {
    if (isDismissing && customAnimation.exit) {
      return `animate__animated ${customAnimation.exit}`;
    }
    if (!isDismissing && customAnimation.enter) {
      return `animate__animated ${customAnimation.enter}`;
    }
  }

  if (position === "top-right") {
    return isDismissing
      ? "animate__animated animate__fadeOutTopRight"
      : "animate__animated animate__fadeInTopRight";
  }
  if (position === "top-left") {
    return isDismissing
      ? "animate__animated animate__fadeOutTopLeft"
      : "animate__animated animate__fadeInTopLeft";
  }
  if (position === "bottom-right") {
    return isDismissing
      ? "animate__animated animate__fadeOutBottomRight"
      : "animate__animated animate__fadeInBottomRight";
  }
  if (position === "bottom-left") {
    return isDismissing
      ? "animate__animated animate__fadeOutBottomLeft"
      : "animate__animated animate__fadeInBottomLeft";
  }
  if (position === "top-center") {
    return isDismissing
      ? "animate__animated animate__fadeOutUp"
      : "animate__animated animate__fadeInDown";
  }
  if (position === "bottom-center") {
    return isDismissing
      ? "animate__animated animate__fadeOutDown"
      : "animate__animated animate__fadeInUp";
  }
  return isDismissing
    ? "animate__animated animate__fadeOutTopRight"
    : "animate__animated animate__fadeInTopRight";
}

export interface ToastItemProps {
  toast: Toast | (() => Toast);
  position?: ToastPosition;
  stackIndex?: number;
  isStacked?: boolean;
  isExpanded?: boolean;
}

export function ToastItem(props: ToastItemProps): Element {
  const currentToast = () => (typeof props.toast === "function" ? props.toast() : props.toast);

  let startX = 0;
  let isDragging = false;
  const [dragOffset, setDragOffset] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);

  const isAssertive = () => currentToast().type === "error";
  const animationClass = () =>
    getSlideAnimationClass(props.position, currentToast().isDismissing, currentToast().animation);

  const handlePointerDown = (e: PointerEvent): void => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a, input, [role='button']")) return;
    if (currentToast().swipeable === false) return;

    startX = e.clientX;
    isDragging = true;
    setDragging(true);
    setDragOffset(0);

    if (
      e.currentTarget instanceof HTMLElement &&
      typeof e.currentTarget.setPointerCapture === "function"
    ) {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Pointer capture not supported in all environments
      }
    }
  };

  const handlePointerMove = (e: PointerEvent): void => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setDragOffset(diff);
  };

  const handlePointerUp = (e: PointerEvent): void => {
    if (!isDragging) return;
    const diff =
      (typeof e.clientX === "number" && e.clientX !== 0 ? e.clientX : startX + dragOffset()) -
      startX;
    const finalOffset = diff !== 0 ? diff : dragOffset();

    isDragging = false;
    setDragging(false);

    if (
      e.currentTarget instanceof HTMLElement &&
      typeof e.currentTarget.releasePointerCapture === "function"
    ) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture was lost or not captured
      }
    }

    const threshold = 70;
    if (Math.abs(finalOffset) > threshold) {
      toast.dismiss(currentToast().id);
    }
    setDragOffset(0);
  };

  const dynamicStyle = (): Record<string, string | number> => {
    const offset = dragOffset();
    if (dragging() && offset !== 0) {
      const absOffset = Math.abs(offset);
      const opacity = Math.max(0.1, 1 - absOffset / 280);
      const scale = Math.max(0.9, 1 - absOffset * 0.0004);
      return {
        transform: `translate3d(${offset}px, 0, 0) scale(${scale})`,
        opacity: opacity,
        transition: "none",
        "touch-action": "pan-y",
        cursor: "grabbing",
      };
    }

    if (props.isStacked && !props.isExpanded && typeof props.stackIndex === "number") {
      const idx = props.stackIndex;
      const isTop = (props.position ?? "top-right").startsWith("top");
      const translateY = isTop ? idx * 10 : -idx * 10;
      const scale = Math.max(0.85, 1 - idx * 0.05);
      const opacity = Math.max(0.4, 1 - idx * 0.15);
      return {
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
        opacity: opacity,
        "z-index": 100 - idx,
        transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease-out",
        "touch-action": "pan-y",
      };
    }

    return {
      "touch-action": "pan-y",
      cursor: currentToast().swipeable !== false ? "grab" : "default",
    };
  };

  return (
    <div
      class="toast-wrapper"
      data-toast-dismissing={currentToast().isDismissing ? "true" : undefined}
      data-toast-id={currentToast().id}
    >
      <div class="toast-wrapper-inner">
        <div
          aria-atomic="true"
          aria-live={isAssertive() ? "assertive" : "polite"}
          class={[
            "alert shadow-lg pointer-events-auto flex items-start sm:items-center justify-between gap-3 text-sm py-3 px-4 rounded-xl",
            "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99]",
            "backdrop-blur-md select-none",
            animationClass(),
            getAlertClass(currentToast().type),
          ]}
          data-toast-dismissing={currentToast().isDismissing ? "true" : undefined}
          data-toast-id={currentToast().id}
          data-toast-type={currentToast().type}
          onMouseEnter={() => toast.pause(currentToast().id)}
          onMouseLeave={() => toast.resume(currentToast().id)}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role={isAssertive() ? "alert" : "status"}
          style={dynamicStyle()}
        >
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <ToastIcon type={currentToast().type} />
            <div class="flex flex-col min-w-0">
              <div class="font-medium leading-snug wrap-break-word">{currentToast().title}</div>
              <Show when={currentToast().description}>
                <div class="text-xs opacity-80 mt-0.5 leading-normal wrap-break-word">
                  {currentToast().description}
                </div>
              </Show>
            </div>
          </div>

          <div class="flex items-center gap-1.5 shrink-0 self-center">
            <Show when={currentToast().action}>
              {(action) => (
                <button
                  class="btn btn-xs btn-outline rounded-md font-medium transition-transform duration-150 hover:scale-105 active:scale-95"
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
                class="btn btn-ghost btn-xs btn-circle opacity-70 hover:opacity-100 hover:bg-black/10 transition-all duration-150 hover:rotate-90 hover:scale-110 active:scale-90"
                onClick={() => toast.dismiss(currentToast().id)}
                type="button"
              >
                ✕
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}
