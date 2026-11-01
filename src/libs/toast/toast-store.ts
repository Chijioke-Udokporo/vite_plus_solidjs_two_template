import { createSignal, type Element as JSXElement } from "solid-js";
import type { DismissOptions, PromiseToastOptions, Toast, ToastOptions, ToastType } from "./types";

const DEFAULT_DURATION = 4000;
let idCounter = 0;

function generateId(): string {
  return `toast-${++idCounter}`;
}

const [toasts, setToasts] = createSignal<readonly Toast[]>([], {
  name: "toast-list",
});

const timerMap = new Map<string, ReturnType<typeof setTimeout>>();
const startTimes = new Map<string, number>();

function clearTimer(id: string): void {
  const timer = timerMap.get(id);
  if (timer) {
    clearTimeout(timer);
    timerMap.delete(id);
  }
  const exitTimer = timerMap.get(`exit-${id}`);
  if (exitTimer) {
    clearTimeout(exitTimer);
    timerMap.delete(`exit-${id}`);
  }
  startTimes.delete(id);
}

function scheduleDismiss(id: string, ms: number): void {
  clearTimer(id);
  if (ms <= 0 || ms === Infinity) return;
  startTimes.set(id, Date.now());
  const timer = setTimeout(() => {
    dismiss(id);
  }, ms);
  timerMap.set(id, timer);
}

export function dismiss(id?: string, options?: DismissOptions): void {
  const immediate = options?.immediate ?? false;

  if (id === undefined) {
    const current = toasts();
    for (const item of current) {
      clearTimer(item.id);
      item.onDismiss?.(item);
    }
    setToasts([]);
    return;
  }

  clearTimer(id);

  if (immediate) {
    setToasts((prev) => {
      const target = prev.find((t) => t.id === id);
      if (target) {
        target.onDismiss?.(target);
      }
      return prev.filter((t) => t.id !== id);
    });
    return;
  }

  let found = false;
  setToasts((prev) =>
    prev.map((t) => {
      if (t.id === id) {
        found = true;
        t.onDismiss?.(t);
        return { ...t, isDismissing: true };
      }
      return t;
    }),
  );

  if (!found) return;

  const exitTimer = setTimeout(() => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    timerMap.delete(`exit-${id}`);
  }, 250);
  timerMap.set(`exit-${id}`, exitTimer);
}

export function pause(id: string): void {
  const current = toasts();
  const target = current.find((t) => t.id === id);
  if (!target || target.isPaused) return;

  const timer = timerMap.get(id);
  if (!timer) return;

  const started = startTimes.get(id) ?? Date.now();
  const elapsed = Date.now() - started;
  const remaining = Math.max(0, target.remainingMs - elapsed);

  clearTimer(id);

  setToasts((prev) =>
    prev.map((t) =>
      t.id === id
        ? {
            ...t,
            remainingMs: remaining,
            isPaused: true,
            pausedAt: Date.now(),
          }
        : t,
    ),
  );
}

export function resume(id: string): void {
  const current = toasts();
  const target = current.find((t) => t.id === id);
  if (!target || !target.isPaused) return;

  setToasts((prev) =>
    prev.map((t) =>
      t.id === id
        ? {
            ...t,
            isPaused: false,
            pausedAt: undefined,
          }
        : t,
    ),
  );

  scheduleDismiss(id, target.remainingMs);
}

export function notify(title: JSXElement | string, options?: ToastOptions): string {
  const id = options?.id ?? generateId();
  const type: ToastType = options?.type ?? "default";
  const duration =
    options?.duration !== undefined
      ? options.duration
      : type === "loading"
        ? Infinity
        : DEFAULT_DURATION;
  const dismissible = options?.dismissible ?? true;
  const swipeable = options?.swipeable ?? true;

  const toastItem: Toast = {
    id,
    title,
    description: options?.description,
    type,
    duration,
    dismissible,
    swipeable,
    animation: options?.animation,
    action: options?.action,
    onDismiss: options?.onDismiss,
    createdAt: Date.now(),
    remainingMs: duration,
    isPaused: false,
    isDismissing: false,
  };

  setToasts((prev) => {
    const existingIndex = prev.findIndex((t) => t.id === id);
    if (existingIndex >= 0) {
      const updated = [...prev];
      updated[existingIndex] = toastItem;
      return updated;
    }
    return [...prev, toastItem];
  });

  scheduleDismiss(id, duration);
  return id;
}

export const show = notify;

export function success(title: JSXElement | string, options?: Omit<ToastOptions, "type">): string {
  return notify(title, { ...options, type: "success" });
}

export function error(title: JSXElement | string, options?: Omit<ToastOptions, "type">): string {
  return notify(title, { ...options, type: "error" });
}

export function info(title: JSXElement | string, options?: Omit<ToastOptions, "type">): string {
  return notify(title, { ...options, type: "info" });
}

export function warning(title: JSXElement | string, options?: Omit<ToastOptions, "type">): string {
  return notify(title, { ...options, type: "warning" });
}

export function loading(title: JSXElement | string, options?: Omit<ToastOptions, "type">): string {
  return notify(title, { ...options, type: "loading" });
}

export function promise<T>(p: Promise<T>, options: PromiseToastOptions<T>): Promise<T> {
  const id = loading(options.loading, {
    duration: Infinity,
    dismissible: false,
  });

  return p
    .then((data) => {
      const successTitle =
        typeof options.success === "function" ? options.success(data) : options.success;
      success(successTitle, {
        id,
        duration: options.duration ?? DEFAULT_DURATION,
        dismissible: true,
      });
      return data;
    })
    .catch((err: unknown) => {
      const errorTitle = typeof options.error === "function" ? options.error(err) : options.error;
      error(errorTitle, {
        id,
        duration: options.duration ?? DEFAULT_DURATION,
        dismissible: true,
      });
      throw err;
    });
}

export function clear(): void {
  dismiss();
}

export function toast(title: JSXElement | string, options?: ToastOptions): string {
  return notify(title, options);
}

toast.show = notify;
toast.success = success;
toast.error = error;
toast.info = info;
toast.warning = warning;
toast.loading = loading;
toast.promise = promise;
toast.dismiss = dismiss;
toast.clear = clear;
toast.pause = pause;
toast.resume = resume;

export { toasts };
