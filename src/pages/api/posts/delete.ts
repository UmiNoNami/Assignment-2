import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";

export const POST: APIRoute = async (Astro) => {
  const supabase = supabaseClient({ cookies });;
  const formData = await Astro.request.formData();

  const id = formData.get("id") as string;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Astro.redirect("/login");
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return Astro.redirect("/");
};
