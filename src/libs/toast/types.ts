import type { Element as JSXElement } from "solid-js";

export type ToastType = "default" | "success" | "error" | "info" | "warning" | "loading";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastAction {
  label: string;
  onClick: (toast: Toast) => void;
}

export interface ToastAnimationOptions {
  enter?: string;
  exit?: string;
}

export interface ToastOptions {
  id?: string;
  description?: JSXElement | string;
  type?: ToastType;
  duration?: number;
  dismissible?: boolean;
  swipeable?: boolean;
  animation?: ToastAnimationOptions;
  action?: ToastAction;
  onDismiss?: (toast: Toast) => void;
  duplicate?: boolean;
}

export interface Toast {
  id: string;
  title: JSXElement | string;
  description?: JSXElement | string;
  type: ToastType;
  duration: number;
  dismissible: boolean;
  swipeable?: boolean;
  animation?: ToastAnimationOptions;
  action?: ToastAction;
  onDismiss?: (toast: Toast) => void;
  createdAt: number;
  remainingMs: number;
  isPaused: boolean;
  pausedAt?: number;
  isDismissing: boolean;
}

export interface DismissOptions {
  immediate?: boolean;
}

export interface PromiseToastOptions<T> {
  loading: string | JSXElement;
  success: string | JSXElement | ((data: T) => string | JSXElement);
  error: string | JSXElement | ((err: unknown) => string | JSXElement);
  duration?: number;
}

export interface ToasterProps {
  position?: ToastPosition;
  duration?: number;
  maxToasts?: number;
  class?: string;
  stacked?: boolean;
  expand?: boolean;
}
