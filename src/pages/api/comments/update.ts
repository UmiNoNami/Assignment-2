import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

export const POST: APIRoute = async (Astro) => {
  const supabase = supabaseServer(Astro);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await Astro.request.formData();
  const id = formData.get("id");
  const content = formData.get("content");
  const slug = formData.get("slug");

  if (!id || !content || !slug) {
    return new Response("Missing data", { status: 400 });
  }

  // 🔒 Ownership check
  const { data: comment } = await supabase
    .from("comments")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!comment || comment.user_id !== user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  // Update comment
  const { error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", id);

  if (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }

  return Astro.redirect(`/articles/${slug}`);
};
