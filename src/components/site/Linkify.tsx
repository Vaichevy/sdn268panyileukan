import { useState, type MouseEvent } from "react";

const URL_PATTERN = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/gi;

function ContentLink({ href }: { href: string }) {
  const [zooming, setZooming] = useState(false);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setZooming(true);
    window.setTimeout(() => {
      setZooming(false);
      window.open(href, "_blank", "noopener,noreferrer");
    }, 500);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`content-link ${zooming ? "content-link-zooming" : ""}`}
    >
      {href}
    </a>
  );
}

/** Renders plain text, turning http:// and https:// URLs into clickable links. */
export function Linkify({ text }: { text?: string | null }) {
  if (!text) return null;

  const parts = text.split(URL_PATTERN);

  return (
    <>
      {parts.map((part, index) =>
        /^https?:\/\//i.test(part) ? (
          <ContentLink key={`${index}-${part}`} href={part} />
        ) : (
          <span key={`${index}-text`}>{part}</span>
        ),
      )}
    </>
  );
}
