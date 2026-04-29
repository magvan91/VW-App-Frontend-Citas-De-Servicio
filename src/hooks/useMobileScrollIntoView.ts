import { useEffect, type RefObject } from "react";

type Options<T extends HTMLElement> = {
  enabled: boolean;
  passes?: 1 | 2;
  ref: RefObject<T>;
  deps: unknown[];
  block?: ScrollLogicalPosition;
  behavior?: ScrollBehavior;
};

export function useMobileScrollIntoView<T extends HTMLElement>({
  enabled,
  passes = 1,
  ref,
  deps,
  block = "end",
  behavior = "smooth",
}: Options<T>) {
  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) return;

    const run = (remaining: number) => {
      el.scrollIntoView({ behavior, block });
      if (remaining <= 1) return;
      requestAnimationFrame(() => run(remaining - 1));
    };

    requestAnimationFrame(() => run(passes));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
