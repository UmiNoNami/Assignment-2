import type { APIRoute } from "astro";
import { supabaseClient } from "../../lib/supabaseClient";

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const supabase = supabaseClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(null, {
    status: 303,
    headers: { Location: "/" },
  });
};
