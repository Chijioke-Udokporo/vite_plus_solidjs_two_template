import "iconify-icon";
import type { JSX } from "@solidjs/web";

export type IconProps = JSX.IntrinsicElements["iconify-icon"];

export const Icon = (props: IconProps) => <iconify-icon {...props} />;
