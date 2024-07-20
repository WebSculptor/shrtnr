import { supabase } from "./supabase";

export async function getClicksForUrls(urlIds: string[]) {
  try {
    const { data, error } = await supabase
      .from("clicks")
      .select("*")
      .in("link_id", urlIds);

    if (error) {
      console.error(error?.message);
      throw new Error("Unable to load clicks");
    }

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}
