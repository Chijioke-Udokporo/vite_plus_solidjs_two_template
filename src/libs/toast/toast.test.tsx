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

      // Exit animation finishes at 250ms
      vi.advanceTimersByTime(250);
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

      vi.advanceTimersByTime(250);
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
      const toastEl = document.querySelector(`.toast-card[data-toast-id="${id}"]`);
      expect(toastEl).not.toBeNull();
      expect(toastEl?.className).toContain("animate-toast-exit-top");
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

      const renderedToasts = document.querySelectorAll(".toast-card[data-toast-id]");
      expect(renderedToasts).toHaveLength(2);
      expect(renderedToasts[0].textContent).toContain("Second");
      expect(renderedToasts[1].textContent).toContain("Third");
    });

    it("applies directional slide-in and slide-out animation classes along the Y-axis", () => {
      const { unmount: unmountRight } = render(() => <Toaster position="top-right" />);
      const id1 = toast("Right Toast");
      flush();

      const rightToast = document.querySelector(`.toast-card[data-toast-id="${id1}"]`);
      expect(rightToast?.className).toContain("animate-toast-enter-top");

      toast.dismiss(id1);
      flush();
      expect(rightToast?.className).toContain("animate-toast-exit-top");

      unmountRight();
      toast.clear();
      flush();

      const { unmount: unmountLeft } = render(() => <Toaster position="top-left" />);
      const id2 = toast("Left Toast");
      flush();

      const leftToast = document.querySelector(`.toast-card[data-toast-id="${id2}"]`);
      expect(leftToast?.className).toContain("animate-toast-enter-top");

      toast.dismiss(id2);
      flush();
      expect(leftToast?.className).toContain("animate-toast-exit-top");

      unmountLeft();
      toast.clear();
      flush();

      render(() => <Toaster position="bottom-center" />);
      const id3 = toast("Bottom Toast");
      flush();

      const bottomToast = document.querySelector(`.toast-card[data-toast-id="${id3}"]`);
      expect(bottomToast?.className).toContain("animate-toast-enter-bottom");

      toast.dismiss(id3);
      flush();
      expect(bottomToast?.className).toContain("animate-toast-exit-bottom");
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

      const toastEl = document.querySelector(`.toast-card[data-toast-id="${id}"]`);
      expect(toastEl?.className).toContain("animate__bounceIn");

      toast.dismiss(id);
      flush();
      expect(toastEl?.className).toContain("animate__bounceOut");
    });

    it("renders solid-toast card design with animated SVG icons and action button", () => {
      render(() => <Toaster position="top-right" />);
      const id = toast("Transform Test", {
        type: "success",
        dismissible: true,
        action: { label: "Retry", onClick: () => {} },
      });
      flush();

      const toastEl = document.querySelector(`.toast-card[data-toast-id="${id}"]`);
      expect(toastEl).not.toBeNull();
      expect(toastEl?.className).toContain("hover:-translate-y-0.5");
      expect(toastEl?.className).toContain("active:scale-[0.99]");

      // SVG animated icon rendered
      const svgIcon = toastEl?.querySelector("svg");
      expect(svgIcon).not.toBeNull();
      expect(svgIcon?.querySelector("animate")).not.toBeNull();

      const actionBtn = toastEl?.querySelector("button.btn-outline");
      expect(actionBtn?.className).toContain("hover:scale-105");
      expect(actionBtn?.className).toContain("active:scale-95");

      const closeBtn = toastEl?.querySelector("button[aria-label='Close notification']");
      expect(closeBtn).not.toBeNull();
    });

    it("dismisses toast via horizontal swipe gesture when exceeding threshold", () => {
      render(() => <Toaster position="top-right" />);
      const id = toast("Swipe Me", { dismissible: true });
      flush();

      const toastEl = document.querySelector(`.toast-card[data-toast-id="${id}"]`) as HTMLElement;
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

      const toastEl = document.querySelector(`.toast-card[data-toast-id="${id}"]`) as HTMLElement;
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

      const toastEl = document.querySelector(`.toast-card[data-toast-id="${id}"]`) as HTMLElement;
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

      const oldEl = document.querySelector(`.toast-card[data-toast-id="${id1}"]`) as HTMLElement;
      const newEl = document.querySelector(`.toast-card[data-toast-id="${id2}"]`) as HTMLElement;

      expect(oldEl).not.toBeNull();
      expect(newEl).not.toBeNull();

      // Top toast (newEl) has stackIndex 0 -> translateY(0), scale(1)
      expect(newEl.style.transform).toContain("translate3d(0, 0px, 0)");
      expect(newEl.style.transform).toContain("scale(1)");

      // Older toast (oldEl) has stackIndex 1 -> translateY(8px), scale(0.95)
      expect(oldEl.style.transform).toContain("translate3d(0, 8px, 0)");
      expect(oldEl.style.transform).toContain("scale(0.95)");
    });

    it("deduplicates and updates an existing toast in place and reactively updates the DOM", () => {
      render(() => <Toaster position="top-right" />);
      const id1 = toast("Initial Login Error", { id: "auth-toast" });
      flush();

      expect(id1).toBe("auth-toast");
      expect(toasts()).toHaveLength(1);
      const card = document.querySelector(`.toast-card[data-toast-id="auth-toast"]`) as HTMLElement;
      expect(card).not.toBeNull();
      expect(card.textContent).toContain("Initial Login Error");

      // Update with the same id
      const id2 = toast.error("Invalid Credentials Attempt 2", { id: "auth-toast" });
      flush();

      expect(id2).toBe("auth-toast");
      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].title).toBe("Invalid Credentials Attempt 2");
      expect(toasts()[0].type).toBe("error");

      // Verify DOM reactively updated without duplicating cards
      const allCards = document.querySelectorAll(".toast-card");
      expect(allCards).toHaveLength(1);
      expect(card.textContent).toContain("Invalid Credentials Attempt 2");
    });

    it("revives a dismissing toast when re-notified with the same id", () => {
      vi.useFakeTimers();
      render(() => <Toaster position="top-right" />);
      toast("Dismissing Soon", { id: "revive-me" });
      flush();

      // Trigger dismiss -> enters isDismissing exit lifecycle
      toast.dismiss("revive-me");
      flush();
      expect(toasts()[0].isDismissing).toBe(true);

      // Re-trigger before 250ms exit completes
      toast("Revived Toast!", { id: "revive-me" });
      flush();

      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].isDismissing).toBe(false);
      expect(toasts()[0].title).toBe("Revived Toast!");

      // Advance past 250ms; it should NOT be removed because exit timer was cleared
      vi.advanceTimersByTime(300);
      flush();
      expect(toasts()).toHaveLength(1);
      expect(toasts()[0].title).toBe("Revived Toast!");
    });

    it("creates duplicates when duplicate option is explicitly true with custom id", () => {
      render(() => <Toaster position="top-right" />);
      const id1 = toast("First Item", { id: "item-group", duplicate: true });
      const id2 = toast("Second Item", { id: "item-group", duplicate: true });
      flush();

      expect(toasts()).toHaveLength(2);
      expect(id1).toBe("item-group");
      expect(id2).toContain("item-group-");

      const allCards = document.querySelectorAll(".toast-card");
      expect(allCards).toHaveLength(2);
    });

    it("creates duplicate toasts by default when no id is provided", () => {
      render(() => <Toaster position="top-right" />);
      toast("Same Message");
      toast("Same Message");
      flush();

      expect(toasts()).toHaveLength(2);
      const allCards = document.querySelectorAll(".toast-card");
      expect(allCards).toHaveLength(2);
    });
  });
});
