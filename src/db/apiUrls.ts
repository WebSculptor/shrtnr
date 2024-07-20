import { supabase, supabaseUrl } from "./supabase";

export async function getUrls(userId: string) {
  try {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error(error?.message);
      throw new Error("Unable to load urls");
    }

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function deleteUrl(urlId: number) {
  try {
    const { data, error } = await supabase
      .from("links")
      .delete()
      .eq("id", urlId);

    if (error) {
      console.error(error?.message);
      throw new Error("Unable to delete url");
    }

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function createShortUrl(
  {
    title,
    longUrl,
    userId,
    customUrl,
  }: { title: string; longUrl: string; customUrl: string; userId: string },
  qrcode: any
) {
  const shortUrl = Math.random().toString(36).substring(2, 6);
  const fileName = `qrcode-${shortUrl}`;

  try {
    const { error: storageError } = await supabase.storage
      .from("qrcodes")
      .upload(fileName, qrcode);

    if (storageError) throw new Error(storageError.message);

    const qr = `${supabaseUrl}/storage/v1/object/public/qrcodes/${fileName}`;

    const { data, error } = await supabase
      .from("links")
      .insert([
        {
          title,
          long_url: longUrl,
          short_url: shortUrl,
          custom_url: customUrl || null,
          user_id: userId,
          qrcode: qr,
        },
      ])
      .select();

    if (error) {
      console.error(error?.message);
      throw new Error("Error creating short url");
    }

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function getLongUrl(id: any) {
  try {
    const { data, error } = await supabase
      .from("links")
      .select("id, long_url")
      .or(`short_url.eq.${id},custom_url.eq.${id}`)
      .single();

    if (error) {
      console.error(error?.message);
      throw new Error("Error fetching short link");
    }

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}
