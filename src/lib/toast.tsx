"use client";

import { toast } from "sonner";

export function showJsonToast(title: string, data: any) {
  toast(title, {
    description: (
      <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
    position: "bottom-right",
    classNames: {
      content: "flex flex-col gap-2",
    },
    style: {
      "--border-radius": "calc(var(--radius) + 4px)",
    } as React.CSSProperties,
  });
}

export function showToast(title: any, description: any) {
  toast(title, {
    description: (
      <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
        {description}
      </pre>
    ),
    position: "bottom-right",
    classNames: {
      content: "flex flex-col gap-2",
    },
    style: {
      "--border-radius": "calc(var(--radius) + 4px)",
    } as React.CSSProperties,
  });
}
