import { createFileRoute } from "@tanstack/react-router";

type TallyField = {
  key?: string;
  label?: string;
  type?: string;
  value?: unknown;
};

function pick(fields: TallyField[], match: RegExp, types: string[]) {
  return fields.find(
    (f) =>
      (f.label && match.test(f.label)) ||
      (types.length > 0 && f.type ? types.includes(f.type) : false),
  );
}

export const Route = createFileRoute("/api/public/webhooks/tally")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        const expected = process.env["TALLY_WEBHOOK_TOKEN"];
        if (!expected || token !== expected) {
          return new Response("Unauthorized", { status: 401 });
        }

        let payload: {
          eventId?: string;
          data?: { responseId?: string; fields?: TallyField[] };
        };
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const fields = payload.data?.fields ?? [];
        const nameField = pick(fields, /nama|name/i, []);
        const ratingField = pick(fields, /rating|bintang/i, ["RATING", "LINEAR_SCALE"]);
        const messageField = pick(fields, /komentar|pesan|message|comment/i, ["TEXTAREA"]);

        const name = String(nameField?.value ?? "").trim().slice(0, 80) || "Pengunjung";
        const message = String(messageField?.value ?? "").trim().slice(0, 1000);
        const ratingRaw = Number(ratingField?.value ?? 5);
        const rating = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(1, Math.round(ratingRaw))) : 5;

        if (!message) return new Response("Missing message", { status: 400 });

        const externalId = payload.data?.responseId ?? payload.eventId ?? null;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("testimonials")
          .upsert(
            { name, message, rating, source: "tally", external_id: externalId, is_approved: false },
            { onConflict: "external_id", ignoreDuplicates: true },
          );
        if (error) {
          console.error("[tally-webhook] insert failed", error.message);
          return new Response("Insert failed", { status: 500 });
        }

        return new Response("ok");
      },
    },
  },
});
