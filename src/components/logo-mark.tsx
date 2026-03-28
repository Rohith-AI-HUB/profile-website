import type { SVGProps } from "react";

type LogoMarkProps = SVGProps<SVGSVGElement> & {
  title?: string;
};

export function LogoMark({
  title = "Rohith B logo",
  ...props
}: LogoMarkProps) {
  return (
    <svg
      aria-label={title}
      fill="none"
      role="img"
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="16" y="16" width="128" height="128" rx="32" fill="#241612" />
      <path
        d="M54 42V118"
        stroke="#FFF7ED"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M54 50H88C104 50 116 61 116 74C116 87 104 98 88 98H54"
        stroke="#FFF7ED"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M82 98L114 122"
        stroke="#FFF7ED"
        strokeLinecap="round"
        strokeWidth="16"
      />
    </svg>
  );
}
