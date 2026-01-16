import { supabaseServer } from "./supabaseServer";

export async function getUser(Astro) {
  const supabase = supabaseServer(Astro);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.user ?? null;
}
