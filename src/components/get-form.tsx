"use client";
// GET form that leaves empty fields (and fields still at their data-default value) out of the URL, so shared filter
// links stay short. Without JavaScript it is a plain GET form and the catalogue ignores the empty values anyway.
export function GetForm({ children, ...props }: Omit<React.FormHTMLAttributes<HTMLFormElement>, "method" | "onSubmit">) {
  return (
    <form {...props} method="get" onSubmit={e => {
      const skipped: (HTMLInputElement | HTMLSelectElement)[] = [];
      for (const el of Array.from(e.currentTarget.elements)) {
        if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) || !el.name) continue;
        if (!el.value.trim() || el.dataset.default === el.value) { el.disabled = true; skipped.push(el); }
      }
      // The form data set is already built; re-enable so the fields work again after back/forward navigation.
      setTimeout(() => skipped.forEach(el => { el.disabled = false; }), 0);
    }}>
      {children}
    </form>
  );
}
