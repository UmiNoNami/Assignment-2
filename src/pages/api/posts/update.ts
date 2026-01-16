import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

export const POST: APIRoute = async (Astro) => {
  const supabase = supabaseClient({ cookies });
  const formData = await Astro.request.formData();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Astro.redirect("/login");
  }

  const { error } = await supabase
  .from("comments")
  .update({ content })
  .eq("id", id)
  .eq("user_id", user.id); 


  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return Astro.redirect(`/posts/${id}`);
};
