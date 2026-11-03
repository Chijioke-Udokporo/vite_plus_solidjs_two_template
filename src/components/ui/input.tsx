import "iconify-icon";
import { omit } from "solid-js";
import { Show, type JSX } from "@solidjs/web";
import { Icon } from "./icon";

export type InputProps = JSX.IntrinsicElements["input"] & {
  title?: string;
  icon?: string;
  iconPosition?: "start" | "end";
};

export const Input = (props: InputProps) => {
  const rest = omit(props, "icon", "iconPosition", "title");
  const position = () => props.iconPosition ?? "start";

  const renderIcon = () => {
    if (!props.icon) return null;
    return <Icon icon={props.icon} class="h-[1em] opacity-50 shrink-0" />;
  };

  return (
    <fieldset class="fieldset">
      <Show when={props.title}>
        <label class="label capitalize" for={props.id || props.title}>
          {props.title}
        </label>
      </Show>

      <label class="input w-full">
        <Show when={position() === "start"}>{renderIcon()}</Show>
        <input {...rest} class="grow border-none outline-none" id={props.id || props.title} />
        <Show when={position() === "end"}>{renderIcon()}</Show>
      </label>
    </fieldset>
  );
};
