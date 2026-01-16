import type { APIRoute } from "astro";
import { createServerClient } from "@supabase/ssr";

export const POST: APIRoute = async ({ cookies }) => {
  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    { cookies }
  );

  await supabase.auth.signOut();

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/",
    },
  });
};
