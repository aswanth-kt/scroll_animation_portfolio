"use client";

/**
 * Tiny app-wide event bus + state for things that live outside React's tree:
 * preloader progress, command palette, toasts and scroll locking.
 */
type Listener<T> = (value: T) => void;

function channel<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener<T>>();
  return {
    get: () => value,
    set(next: T) {
      value = next;
      listeners.forEach((l) => l(value));
    },
    subscribe(listener: Listener<T>) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

/** 0 → 1 load progress of the hero's priority frames. */
export const loadProgress = channel(0);
/** Flips to true once the preloader has finished its exit animation. */
export const introDone = channel(false);
/** Command palette open state. */
export const paletteOpen = channel(false);
/** Latest toast message. */
export const toast = channel<{ id: number; message: string } | null>(null);

let toastId = 0;
export const showToast = (message: string) => toast.set({ id: ++toastId, message });

export async function copyToClipboard(text: string, message = "Copied to clipboard") {
  try {
    await navigator.clipboard.writeText(text);
    showToast(message);
  } catch {
    showToast("Couldn't copy — please copy it manually");
  }
}
