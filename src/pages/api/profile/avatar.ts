import type { APIRoute } from "astro";
import { supabaseServer } from "../../../lib/supabaseServer";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

export const POST: APIRoute = async (Astro) => {
  // 1. Auth check (safe)
  const supabase = supabaseServer(Astro);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Read uploaded file
  const formData = await Astro.request.formData();
  const file = formData.get("avatar");

  if (!(file instanceof File)) {
    return new Response("No file selected", { status: 400 });
  }

  // 3. Build file path
  const ext = file.name.split(".").pop();
  const path = `${user.id}/${user.id}.${ext}`;

  // 4. Upload using admin client
  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) {
    console.error(uploadError);
    return new Response(uploadError.message, { status: 500 });
  }

  // 5. Get public URL (DECLARED ONCE)
  const { data: urlData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(path);

  // 6. Save / update profile
  const { error } = await supabase
   .from("profiles")
   .upsert({
    id: user.id,
    avatar_url: `${urlData.publicUrl}?v=${Date.now()}`,
   });


  if (error) {
    console.error(error);
    return new Response(error.message, { status: 500 });
  }

  // 7. Redirect back to account
  return Astro.redirect("/account", 303);
};
