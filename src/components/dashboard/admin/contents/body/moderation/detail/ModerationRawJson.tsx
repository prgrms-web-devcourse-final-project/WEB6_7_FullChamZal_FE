"use client";

export default function ModerationRawJson({
  rawResponseJson,
}: {
  rawResponseJson?: string | null;
}) {
  return (
    <section className="rounded-xl border p-4">
      <div className="text-sm font-semibold mb-3">rawResponseJson (원문)</div>

      <pre
        className="
          text-[11px] md:text-xs
          whitespace-pre-wrap wrap-break-word
          rounded-lg bg-gray-50 p-3
          max-h-[40vh] md:max-h-[45vh]
          overflow-auto
        "
      >
        {rawResponseJson ?? ""}
      </pre>
    </section>
  );
}
