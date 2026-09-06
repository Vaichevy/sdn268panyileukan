import { useId } from "react";

export function InstagramIcon({ className }: { className?: string }) {
  const id = useId();
  const gradientId = `instagram-gradient-${id}`;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="2"
          y1="22"
          x2="22"
          y2="2"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f09433" />
          <stop offset="0.25" stopColor="#e6683c" />
          <stop offset="0.5" stopColor="#dc2743" />
          <stop offset="0.75" stopColor="#cc2366" />
          <stop offset="1" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM18 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      />
    </svg>
  );
}
