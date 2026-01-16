import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

export const POST: APIRoute = async (Astro) => {
  const supabase = supabaseServer(Astro);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await Astro.request.formData();
  const comment_id = formData.get("comment_id");
  const redirect = formData.get("redirect");

  if (!comment_id || !redirect) {
    return new Response(
      JSON.stringify({ comment_id, redirect }),
      { status: 400 }
    );
  }

  const { data: comment } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", comment_id)
    .single();

  if (!comment || comment.user_id !== user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  await supabase
    .from("comments")
    .delete()
    .eq("id", comment_id);

  return Astro.redirect(redirect);
};
