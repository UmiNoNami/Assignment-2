import type { APIRoute } from "astro";
import { supabaseServer } from "../../lib/supabaseServer";

export const POST: APIRoute = async ({ request, cookies }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  const supabase = supabaseServer({ request, cookies });

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response("OK", { status: 200 });
};

