import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeWebsite(url, selector) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    },
    timeout: 20000
  });

  const html = response.data;
  const $ = cheerio.load(html);

  const text = selector
    ? $(selector)
        .map((i, el) => $(el).text().trim())
        .get()
    : $("body").text().trim().slice(0, 2000);

  const images = $("img")
    .map((i, el) => resolve(url, $(el).attr("src")))
    .get()
    .filter(Boolean);

  const videos = [
    ...$("video")
      .map((i, el) => resolve(url, $(el).attr("src")))
      .get(),
    ...$("source")
      .map((i, el) => resolve(url, $(el).attr("src")))
      .get(),
    ...$("iframe")
      .map((i, el) => resolve(url, $(el).attr("src")))
      .get()
  ].filter(Boolean);

  const links = $("a")
    .map((i, el) => resolve(url, $(el).attr("href")))
    .get()
    .filter(Boolean);

  const metadata = {
    title: $("title").text() || null,
    description: $('meta[name="description"]').attr("content") || null,
    ogImage: $('meta[property="og:image"]').attr("content") || null,
    ogVideo: $('meta[property="og:video"]').attr("content") || null
  };

  return { text, images, videos, links, metadata };
}

function resolve(base, relative) {
  try {
    if (!relative) return null;
    return new URL(relative, base).href;
  } catch {
    return null;
  }
}
