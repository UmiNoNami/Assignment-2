import type { APIRoute } from "astro";
import { supabaseClient } from "../../lib/supabaseClient";

export const POST: APIRoute = async () => {
  await supabaseClient.auth.signOut();

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/",
    },
  });
};
