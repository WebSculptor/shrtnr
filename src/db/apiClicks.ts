import { UAParser } from "ua-parser-js";
import { supabase } from "./supabase";

const parser = new UAParser();

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

export const storeClicks = async ({
  id,
  originalUrl,
}: {
  id: number;
  originalUrl: string;
}) => {
  try {
    const res = parser.getResult();
    const device = res.device.type || "desktop";
    const browser = res.browser.name || "Chrome";

    let response;
    try {
      response = await fetch("https://ipapi.co/json");
    } catch (error: any) {
      if (error.message.includes("net::ERR_BLOCKED_BY_ADBLOCKER")) {
        throw new Error(
          "Ad blocker is blocking the request. Please disable it and try again."
        );
      }
      throw error;
    }

    const { city, country_name: country } = await response.json();

    await supabase.from("clicks").insert({
      link_id: id,
      country,
      city,
      device,
      browser,
    });

    window.location.href = originalUrl;
  } catch (error) {
    console.error(error);
    throw new Error("Error recording clicks");
  }
};

export async function getClicksFromUsl({ urlId }: { urlId: number }) {
  try {
    const { data, error } = await supabase
      .from("clicks")
      .select("*")
      .eq("link_id", urlId);

    if (error) {
      console.error(error?.message);
      throw new Error("Unable to load stats");
    }

    return data;
  } catch (error: any) {
    throw Error(error);
  }
}
