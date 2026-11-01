import { cleanup, fireEvent, render } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { toast, toasts } from "./toast-store";
import { Toaster } from "./Toaster";

describe("Custom Toast System", () => {
  beforeEach(() => {
    toast.clear();
    flush();
  });

  afterEach(() => {
    cleanup();
    toast.clear();
    flush();
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  describe("toast store", () => {
    it("adds a basic toast with default settings", () => {
      const id = toast("Hello World");
      flush();

      expect(toasts()).toHaveLength(1);
      const item = toasts()[0];
      expect(item.id).toBe(id);
      expect(item.title).toBe("Hello World");
      expect(item.type).toBe("default");
      expect(item.duration).toBe(4000);
      expect(item.dismissible).toBe(true);
      expect(item.isDismissing).toBe(false);
    });

    it("creates variant toasts (success, error, info, warning, loading)", () => {
      const sId = toast.success("Saved");
      const eId = toast.error("Failed");
      const iId = toast.info("Notice");
      const wId = toast.warning("Caution");
      const lId = toast.loading("Processing...");
      flush();

      expect(toasts()).toHaveLength(5);
      const list = toasts();
      expect(list.find((t) => t.id === sId)?.type).toBe("success");
      expect(list.find((t) => t.id === eId)?.type).toBe("error");
      expect(list.find((t) => t.id === iId)?.type).toBe("info");
      expect(list.find((t) => t.id === wId)?.type).toBe("warning");
      const loadingToast = list.find((t) => t.id === lId);
      expect(loadingToast?.type).toBe("loading");
      expect(loadingToast?.duration).toBe(Infinity);
    });

    it("dismisses an individual toast with slide-out exit lifecycle", () => {
      vi.useFakeTimers();
      let dismissed = false;
      const id = toast("Self-destruct", {
        onDismiss: () => {
          dismissed = true;
        },
      });
      flush();
      expect(toasts()).toHaveLength(1);

      toast.dismiss(id);
      flush();

      // Toast marks isDismissing: true while exit animation plays
      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].isDismissing).toBe(true);
      expect(dismissed).toBe(true);

      // Toast is removed after 250ms slide-out animation
      vi.advanceTimersByTime(250);
      flush();
      expect(toasts()).toHaveLength(0);
    });

    it("supports immediate dismissal option", () => {
      const id = toast("Instant Disappear");
      flush();
      expect(toasts()).toHaveLength(1);

      toast.dismiss(id, { immediate: true });
      flush();
      expect(toasts()).toHaveLength(0);
    });

    it("clears all active toasts immediately", () => {
      toast("One");
      toast("Two");
      toast("Three");
      flush();
      expect(toasts()).toHaveLength(3);

      toast.clear();
      flush();
      expect(toasts()).toHaveLength(0);
    });

    it("auto-dismisses after duration using fake timers", () => {
      vi.useFakeTimers();
      toast("Ephemeral", { duration: 2000 });
      flush();
      expect(toasts()).toHaveLength(1);

      vi.advanceTimersByTime(1999);
      flush();
      expect(toasts()).toHaveLength(1);

      // At 2000ms dismiss() triggers slide-out
      vi.advanceTimersByTime(2);
      flush();
      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].isDismissing).toBe(true);

      // Exit animation finishes at 200ms
      vi.advanceTimersByTime(200);
      flush();
      expect(toasts()).toHaveLength(0);
    });

    it("supports pause and resume for auto-dismiss timers", () => {
      vi.useFakeTimers();
      const id = toast("Hover Me", { duration: 3000 });
      flush();

      vi.advanceTimersByTime(1000);
      toast.pause(id);
      flush();

      vi.advanceTimersByTime(5000);
      flush();
      // Should still be present because it was paused
      expect(toasts()).toHaveLength(1);

      toast.resume(id);
      flush();

      // Resume has ~2000ms left
      vi.advanceTimersByTime(1999);
      flush();
      expect(toasts()).toHaveLength(1);

      vi.advanceTimersByTime(10);
      flush();
      expect(toasts()[0].isDismissing).toBe(true);

      vi.advanceTimersByTime(200);
      flush();
      expect(toasts()).toHaveLength(0);
    });

    it("resolves toast.promise on success", async () => {
      const deferred = Promise.resolve("Data payload");
      const promiseCall = toast.promise(deferred, {
        loading: "Loading data...",
        success: (d: string) => `Loaded: ${d}`,
        error: "Failed to load",
      });
      flush();

      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].type).toBe("loading");

      await promiseCall;
      flush();

      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].type).toBe("success");
      expect(toasts()[0].title).toBe("Loaded: Data payload");
    });

    it("rejects toast.promise on error", async () => {
      const deferred = Promise.reject(new Error("Server exploded"));
      const promiseCall = toast.promise(deferred, {
        loading: "Saving...",
        success: "Saved!",
        error: (err: unknown) => (err instanceof Error ? err.message : "Error"),
      });
      flush();

      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].type).toBe("loading");

      await expect(promiseCall).rejects.toThrow("Server exploded");
      flush();

      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].type).toBe("error");
      expect(toasts()[0].title).toBe("Server exploded");
    });
  });

  describe("<Toaster /> component", () => {
    it("renders active toasts in the DOM with title, description, and action", () => {
      render(() => <Toaster position="top-right" />);
      let actionClicked = false;

      toast("Order Complete", {
        description: "Your receipt was sent to email.",
        type: "success",
        action: {
          label: "View Order",
          onClick: () => {
            actionClicked = true;
          },
        },
      });
      flush();

      const notificationContainer = document.querySelector('[role="region"]');
      expect(notificationContainer).not.toBeNull();
      expect(notificationContainer?.textContent).toContain("Order Complete");
      expect(notificationContainer?.textContent).toContain("Your receipt was sent to email.");

      const actionButton = document.querySelector("button.btn-outline");
      expect(actionButton).not.toBeNull();
      expect(actionButton?.textContent).toBe("View Order");

      if (actionButton) {
        fireEvent.click(actionButton);
        expect(actionClicked).toBe(true);
      }
    });

    it("plays slide-out animation and removes toast when close button is clicked", () => {
      vi.useFakeTimers();
      render(() => <Toaster position="top-right" />);
      const id = toast("Dismiss Toast", { dismissible: true });
      flush();

      const closeButton = document.querySelector('button[aria-label="Close notification"]');
      expect(closeButton).not.toBeNull();

      if (closeButton) {
        fireEvent.click(closeButton);
        flush();
      }

      // Should be in slide-out dismissing state
      const toastEl = document.querySelector(`.alert[data-toast-id="${id}"]`);
      expect(toastEl).not.toBeNull();
      expect(toastEl?.className).toContain("animate__animated");
      expect(toastEl?.className).toContain("animate__fadeOutTopRight");
      expect(toastEl?.getAttribute("data-toast-dismissing")).toBe("true");

      const wrapperEl = document.querySelector(`.toast-wrapper[data-toast-id="${id}"]`);
      expect(wrapperEl?.getAttribute("data-toast-dismissing")).toBe("true");

      vi.advanceTimersByTime(250);
      flush();

      expect(toasts()).toHaveLength(0);
      expect(document.querySelector(`[data-toast-id="${id}"]`)).toBeNull();
    });

    it("respects maxToasts prop", () => {
      render(() => <Toaster maxToasts={2} />);
      toast("First");
      toast("Second");
      toast("Third");
      flush();

      const renderedToasts = document.querySelectorAll(".alert[data-toast-id]");
      expect(renderedToasts).toHaveLength(2);
      expect(renderedToasts[0].textContent).toContain("Second");
      expect(renderedToasts[1].textContent).toContain("Third");
    });

    it("applies directional slide-in and slide-out animation classes using animate.css", () => {
      const { unmount: unmountRight } = render(() => <Toaster position="top-right" />);
      const id1 = toast("Right Toast");
      flush();

      const rightToast = document.querySelector(`.alert[data-toast-id="${id1}"]`);
      expect(rightToast?.className).toContain("animate__animated");
      expect(rightToast?.className).toContain("animate__fadeInTopRight");
      expect(rightToast?.className).toContain("hover:scale-[1.01]");

      toast.dismiss(id1);
      flush();
      expect(rightToast?.className).toContain("animate__fadeOutTopRight");

      unmountRight();
      toast.clear();
      flush();

      const { unmount: unmountLeft } = render(() => <Toaster position="top-left" />);
      const id2 = toast("Left Toast");
      flush();

      const leftToast = document.querySelector(`.alert[data-toast-id="${id2}"]`);
      expect(leftToast?.className).toContain("animate__fadeInTopLeft");

      toast.dismiss(id2);
      flush();
      expect(leftToast?.className).toContain("animate__fadeOutTopLeft");

      unmountLeft();
      toast.clear();
      flush();

      render(() => <Toaster position="bottom-center" />);
      const id3 = toast("Bottom Toast");
      flush();

      const bottomToast = document.querySelector(`.alert[data-toast-id="${id3}"]`);
      expect(bottomToast?.className).toContain("animate__fadeInUp");

      toast.dismiss(id3);
      flush();
      expect(bottomToast?.className).toContain("animate__fadeOutDown");
    });

    it("collapses wrapper height and transitions remaining toasts to new position on dismissal", () => {
      render(() => <Toaster position="top-right" />);
      const id1 = toast("First Toast");
      const id2 = toast("Second Toast");
      flush();

      const wrapper1 = document.querySelector(`.toast-wrapper[data-toast-id="${id1}"]`);
      const wrapper2 = document.querySelector(`.toast-wrapper[data-toast-id="${id2}"]`);

      expect(wrapper1).not.toBeNull();
      expect(wrapper2).not.toBeNull();
      expect(wrapper1?.getAttribute("data-toast-dismissing")).toBeNull();

      // Dismiss the first toast
      toast.dismiss(id1);
      flush();

      // Wrapper marks dismissing for layout transition collapse
      expect(wrapper1?.getAttribute("data-toast-dismissing")).toBe("true");
      expect(wrapper2?.getAttribute("data-toast-dismissing")).toBeNull();
    });

    it("supports custom Animate.style animation overrides", () => {
      render(() => <Toaster position="top-right" />);
      const id = toast("Bouncy Toast", {
        animation: { enter: "animate__bounceIn", exit: "animate__bounceOut" },
      });
      flush();

      const toastEl = document.querySelector(`[data-toast-id="${id}"]`);
      expect(toastEl?.className).toContain("animate__bounceIn");

      toast.dismiss(id);
      flush();
      expect(toastEl?.className).toContain("animate__bounceOut");
    });

    it("renders micro-interaction transform classes for icons, buttons, and close affordance", () => {
      render(() => <Toaster position="top-right" />);
      const id = toast("Transform Test", {
        dismissible: true,
        action: { label: "Retry", onClick: () => {} },
      });
      flush();

      const toastEl = document.querySelector(`[data-toast-id="${id}"]`);
      expect(toastEl).not.toBeNull();
      expect(toastEl?.className).toContain("hover:-translate-y-0.5");
      expect(toastEl?.className).toContain("active:scale-[0.99]");

      const iconWrapper = toastEl?.querySelector(".animate-toast-icon-pop");
      expect(iconWrapper).not.toBeNull();

      const actionBtn = toastEl?.querySelector("button.btn-outline");
      expect(actionBtn?.className).toContain("hover:scale-105");
      expect(actionBtn?.className).toContain("active:scale-95");

      const closeBtn = toastEl?.querySelector("button[aria-label='Close notification']");
      expect(closeBtn?.className).toContain("hover:rotate-90");
      expect(closeBtn?.className).toContain("hover:scale-110");
    });

    it("dismisses toast via horizontal swipe gesture when exceeding threshold", () => {
      render(() => <Toaster position="top-right" />);
      const id = toast("Swipe Me", { dismissible: true });
      flush();

      const toastEl = document.querySelector(`[data-toast-id="${id}"]`) as HTMLElement;
      expect(toastEl).not.toBeNull();

      // Simulate swipe right past 70px threshold
      fireEvent.pointerDown(toastEl, { clientX: 100, button: 0 });
      fireEvent.pointerMove(toastEl, { clientX: 190 });
      fireEvent.pointerUp(toastEl, { clientX: 190 });
      flush();

      // Toast starts dismissing
      expect(toasts()[0]?.isDismissing).toBe(true);
      expect(toastEl.getAttribute("data-toast-dismissing")).toBe("true");
    });

    it("does not dismiss toast when swipe distance is below threshold", () => {
      render(() => <Toaster position="top-right" />);
      const id = toast("Subtle Tap", { dismissible: true });
      flush();

      const toastEl = document.querySelector(`[data-toast-id="${id}"]`) as HTMLElement;
      expect(toastEl).not.toBeNull();

      // Simulate minor swipe of 20px
      fireEvent.pointerDown(toastEl, { clientX: 100, button: 0 });
      fireEvent.pointerMove(toastEl, { clientX: 120 });
      fireEvent.pointerUp(toastEl, { clientX: 120 });
      flush();

      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].isDismissing).toBe(false);
    });

    it("ignores swipe gestures when swipeable is set to false", () => {
      render(() => <Toaster position="top-right" />);
      const id = toast("No Swipe", { dismissible: true, swipeable: false });
      flush();

      const toastEl = document.querySelector(`[data-toast-id="${id}"]`) as HTMLElement;
      expect(toastEl).not.toBeNull();

      fireEvent.pointerDown(toastEl, { clientX: 100, button: 0 });
      fireEvent.pointerMove(toastEl, { clientX: 300 });
      fireEvent.pointerUp(toastEl, { clientX: 300 });
      flush();

      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].isDismissing).toBe(false);
    });

    it("applies stack 3D depth transforms when stacked mode is active", () => {
      render(() => <Toaster position="top-right" stacked={true} />);
      const id1 = toast("Old Toast");
      const id2 = toast("New Toast");
      flush();

      const oldEl = document.querySelector(`[data-toast-id="${id1}"]`) as HTMLElement;
      const newEl = document.querySelector(`[data-toast-id="${id2}"]`) as HTMLElement;

      expect(oldEl).not.toBeNull();
      expect(newEl).not.toBeNull();

      // Top toast (newEl) has stackIndex 0 -> translateY(0), scale(1)
      expect(newEl.style.transform).toContain("translate3d(0, 0px, 0)");
      expect(newEl.style.transform).toContain("scale(1)");

      // Older toast (oldEl) has stackIndex 1 -> translateY(10px), scale(0.95)
      expect(oldEl.style.transform).toContain("translate3d(0, 10px, 0)");
      expect(oldEl.style.transform).toContain("scale(0.95)");
    });
  });
});
