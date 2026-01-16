import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

export const POST: APIRoute = async (Astro) => {
  const supabase = supabaseServer(Astro);

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Read form data
  const formData = await Astro.request.formData();
  const content = formData.get("content");
  const article_slug = formData.get("article_slug");

  if (!content || !article_slug) {
    return new Response("Missing content or slug", { status: 400 });
  }

  // Insert comment
  const { error } = await supabase
    .from("comments")
    .insert({
      content,
      article_slug,
      user_id: user.id,
    });

  if (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }

  
  return Astro.redirect(`/articles/${article_slug}`);
};
