import type { JSX } from "@solidjs/web";
import type { IconifyIconProperties } from "iconify-icon";

declare module "@solidjs/web" {
  namespace JSX {
    interface IntrinsicElements {
      "iconify-icon": JSX.HTMLAttributes<HTMLElement> & IconifyIconProperties;
    }
  }
}
