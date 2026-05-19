/**
 * JSON-LD <script> render helper. Server component, escape edilmiş JSON.
 */
export default function JsonLdScript({
  data,
}: {
  data: Record<string, unknown> | null;
}) {
  if (!data) return null;

  // < karakterini güvenli encode et (XSS önleme — admin-only girdi olsa da)
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
