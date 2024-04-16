"use client";
import { useFormStatus } from "react-dom";
function ButtonSubmit({ value, ...props }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} {...props}>
      {pending ? "loading..." : value}
    </button>
  );
}

export default ButtonSubmit;
