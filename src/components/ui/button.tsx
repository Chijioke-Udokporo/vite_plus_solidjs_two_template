import { Show, type JSX } from "@solidjs/web";
import { omit, type Accessor, type SourceAccessor } from "solid-js";
import { Icon } from "./icon";

type ButtonProps = JSX.IntrinsicElements["button"] & {
  title: string;
  icon?: string;
  iconPosition?: "start" | "end";
  isSubmitting: Accessor<boolean> | SourceAccessor<boolean | undefined>;
};

export const Button = (props: ButtonProps) => {
  const rest = omit(props, "isSubmitting", "title");
  const position = () => props.iconPosition ?? "end";

  const renderIcon = () => {
    if (!props.icon) return null;
    return <Icon icon={props.icon} class="h-[1em] shrink-0" />;
  };

  return (
    <button class="btn btn-primary " {...rest}>
      <Show when={position() === "start"}>{renderIcon()}</Show>
      <Show when={props.isSubmitting()} fallback={<p class="font-medium">{props.title}</p>}>
        <div class="flex items-center gap-2 font-medium">
          <span class="loading loading-spinner loading-xs"></span>
          Processing . . .
        </div>
      </Show>
      <Show when={position() === "end"}>{renderIcon()}</Show>
    </button>
  );
};

export const GoogleBtn = () => (
  <button class="btn bg-white  text-black text-sm border-base-content/10">
    <svg
      aria-label="Google logo"
      width="16"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <g>
        <path d="m0 0H512V512H0" fill="#fff"></path>
        <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
        <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
        <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
        <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
      </g>
    </svg>

    <p class="font-medium">Continue With Google</p>
  </button>
);
