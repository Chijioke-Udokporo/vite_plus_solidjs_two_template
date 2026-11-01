import type { Element } from "solid-js";
import { Show, createSignal } from "solid-js";
import { toast } from "./toast-store";
import type { Toast, ToastAnimationOptions, ToastPosition } from "./types";

function SuccessIcon(): Element {
  return (
    <svg class="size-5 shrink-0 overflow-visible" viewBox="0 0 32 32">
      <circle cx="16" cy="16" fill="#10B981" r="0">
        <animate
          attributeName="opacity"
          dur="0.35s"
          fill="freeze"
          keyTimes="0; 0.6; 1"
          values="0; 1; 1"
        />
        <animate
          attributeName="r"
          dur="0.35s"
          fill="freeze"
          keyTimes="0; 0.6; 1"
          values="0; 17.5; 16"
        />
      </circle>
      <circle cx="16" cy="16" fill="#10B981" opacity="0" r="12">
        <animate attributeName="opacity" begin="320ms" dur="1s" fill="freeze" values="1; 0" />
        <animate attributeName="r" begin="320ms" dur="1s" fill="freeze" values="12; 26" />
      </circle>
      <path
        d="M9.8,17.2l3.8,3.6c0.1,0.1,0.3,0.1,0.4,0l9.6-9.7"
        fill="none"
        stroke="#FFFFFF"
        stroke-dasharray="22"
        stroke-dashoffset="22"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="3.5"
      >
        <animate
          attributeName="stroke-dashoffset"
          begin="250ms"
          calcMode="spline"
          dur="0.25s"
          fill="freeze"
          keySplines="0.0, 0.0, 0.58, 1.0"
          keyTimes="0; 1"
          values="22;0"
        />
      </path>
    </svg>
  );
}

function ErrorIcon(): Element {
  return (
    <svg class="size-5 shrink-0 overflow-visible" viewBox="0 0 32 32">
      <circle cx="16" cy="16" fill="#EF4444" r="0">
        <animate
          attributeName="opacity"
          dur="0.35s"
          fill="freeze"
          keyTimes="0; 0.6; 1"
          values="0; 1; 1"
        />
        <animate
          attributeName="r"
          dur="0.35s"
          fill="freeze"
          keyTimes="0; 0.6; 1"
          values="0; 17.5; 16"
        />
      </circle>
      <circle cx="16" cy="16" fill="#EF4444" opacity="0" r="12">
        <animate attributeName="opacity" begin="320ms" dur="1s" fill="freeze" values="1; 0" />
        <animate attributeName="r" begin="320ms" dur="1s" fill="freeze" values="12; 26" />
      </circle>
      <path
        d="M16,8l0,8"
        fill="none"
        stroke="#FFFFFF"
        stroke-dasharray="9"
        stroke-dashoffset="9"
        stroke-linecap="round"
        stroke-width="3.5"
      >
        <animate
          attributeName="stroke-dashoffset"
          begin="250ms"
          calcMode="spline"
          dur="0.2s"
          fill="freeze"
          keySplines="0.0, 0.0, 0.58, 1.0"
          keyTimes="0; 1"
          values="9;0"
        />
      </path>
      <circle cx="16" cy="22.5" fill="#FFFFFF" opacity="0" r="2">
        <animate
          attributeName="opacity"
          begin="350ms"
          calcMode="spline"
          dur="0.25s"
          fill="freeze"
          keySplines="0.0, 0.0, 0.58, 1.0"
          keyTimes="0; 1"
          values="0;1"
        />
      </circle>
    </svg>
  );
}

function LoaderIcon(): Element {
  return (
    <svg class="size-5 shrink-0 overflow-visible" viewBox="0 0 32 32">
      <circle cx="16" cy="16" fill="none" r="10" stroke="#E5E7EB" stroke-width="3.5" />
      <path
        d="M16,6c3,0,5.7,1.3,7.5,3.4c0.6,0.7,1.1,1.4,1.5,2.2"
        fill="none"
        stroke="#4B5563"
        stroke-linecap="round"
        stroke-width="3.5"
      >
        <animateTransform
          attributeName="transform"
          dur="0.75s"
          from="0 16 16"
          repeatCount="indefinite"
          to="360 16 16"
          type="rotate"
        />
      </path>
    </svg>
  );
}

function WarningIcon(): Element {
  return (
    <svg class="size-5 shrink-0 overflow-visible" viewBox="0 0 32 32">
      <circle cx="16" cy="16" fill="#F59E0B" r="16" />
      <path d="M16,9l0,7" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-width="3.5" />
      <circle cx="16" cy="22.5" fill="#FFFFFF" r="2" />
    </svg>
  );
}

function InfoIcon(): Element {
  return (
    <svg class="size-5 shrink-0 overflow-visible" viewBox="0 0 32 32">
      <circle cx="16" cy="16" fill="#3B82F6" r="16" />
      <circle cx="16" cy="9.5" fill="#FFFFFF" r="2" />
      <path d="M16,14l0,8" fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-width="3.5" />
    </svg>
  );
}

function DefaultIcon(): Element {
  return (
    <svg
      class="size-5 shrink-0 text-gray-500"
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
  );
}

function ToastIcon(props: { type: Toast["type"] }): Element {
  return (
    <div class="flex items-center justify-center shrink-0">
      <Show when={props.type === "success"}>
        <SuccessIcon />
      </Show>
      <Show when={props.type === "error"}>
        <ErrorIcon />
      </Show>
      <Show when={props.type === "loading"}>
        <LoaderIcon />
      </Show>
      <Show when={props.type === "warning"}>
        <WarningIcon />
      </Show>
      <Show when={props.type === "info"}>
        <InfoIcon />
      </Show>
      <Show when={props.type === "default"}>
        <DefaultIcon />
      </Show>
    </div>
  );
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

  const isTop = position.startsWith("top");
  if (isTop) {
    return isDismissing ? "animate-toast-exit-top" : "animate-toast-enter-top";
  }
  return isDismissing ? "animate-toast-exit-bottom" : "animate-toast-enter-bottom";
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
      const translateY = isTop ? idx * 8 : -idx * 8;
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
            "toast-card pointer-events-auto flex items-center justify-between gap-3 text-[14px] leading-tight py-2.5 px-3.5 rounded-lg max-w-[360px]",
            "bg-white dark:bg-[#1d232a] text-[#363636] dark:text-[#f3f4f6]",
            "shadow-[0_3px_10px_rgba(0,0,0,0.1),0_3px_3px_rgba(0,0,0,0.05)] border border-black/5 dark:border-white/10",
            "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99]",
            animationClass(),
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
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <ToastIcon type={currentToast().type} />
            <div class="flex flex-col min-w-0 py-0.5">
              <div class="font-normal text-[14px] leading-snug wrap-break-word">
                {currentToast().title}
              </div>
              <Show when={currentToast().description}>
                <div class="text-[12px] opacity-75 mt-0.5 leading-normal wrap-break-word">
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
                class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xs size-5 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
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
