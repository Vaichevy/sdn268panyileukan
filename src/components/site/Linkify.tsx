const URL_PATTERN = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/gi;

function ContentLink({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="content-link">
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
