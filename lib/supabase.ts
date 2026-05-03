import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const BUCKET = "campaign-covers"

/**
 * Upload a campaign cover image to Supabase Storage.
 * Returns the public URL on success, or null on failure.
 */
export async function uploadCoverImage(file: File, creatorAddress: string): Promise<string | null> {
  const ext = file.name.split(".").pop() ?? "png"
  const path = `${creatorAddress}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    console.warn("Cover upload failed:", error.message)
    return null
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
