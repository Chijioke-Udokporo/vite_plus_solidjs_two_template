import type { JSX } from "@solidjs/web";

type InputProps = JSX.IntrinsicElements["input"] & {
  title: string;
};

export const Input = (props: InputProps) => (
  <fieldset class="fieldset">
    <label class="label capitalize" for={props.title}>
      {props?.title}
    </label>

    <input {...props} class="input" id={props?.id || props?.title} />
  </fieldset>
);
