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

  // -----------------------------
  // 1. TEXT (selector or full body)
  // -----------------------------
  let textResult = null;
  if (selector) {
    textResult = [];
    $(selector).each((i, el) => {
      const t = $(el).text().trim();
      if (t) textResult.push(t);
    });
  } else {
    textResult = $("body").text().trim().slice(0, 2000);
  }

  // -----------------------------
  // 2. IMAGES
  // -----------------------------
  const images = [];
  $("img").each((i, el) => {
    const src = $(el).attr("src");
    if (src && !src.startsWith("data:")) {
      images.push(resolveUrl(url, src));
    }
  });

  // -----------------------------
  // 3. VIDEOS (mp4, webm, iframe embeds)
  // -----------------------------
  const videos = [];

  // <video src="">
  $("video").each((i, el) => {
    const src = $(el).attr("src");
    if (src) videos.push(resolveUrl(url, src));
  });

  // <source src="">
  $("source").each((i, el) => {
    const src = $(el).attr("src");
    if (src && (src.endsWith(".mp4") || src.endsWith(".webm"))) {
      videos.push(resolveUrl(url, src));
    }
  });

  // iframe embeds (YouTube, Vimeo, etc.)
  $("iframe").each((i, el) => {
    const src = $(el).attr("src");
    if (src && src.includes("youtube") || src.includes("vimeo")) {
      videos.push(resolveUrl(url, src));
    }
  });

  // -----------------------------
  // 4. LINKS
  // -----------------------------
  const links = [];
  $("a").each((i, el) => {
    const href = $(el).attr("href");
    if (href && !href.startsWith("#")) {
      links.push(resolveUrl(url, href));
    }
  });

  // -----------------------------
  // 5. METADATA
  // -----------------------------
  const metadata = {
    title: $("title").text() || null,
    description: $('meta[name="description"]').attr("content") || null,
    ogImage: $('meta[property="og:image"]').attr("content") || null,
    ogVideo: $('meta[property="og:video"]').attr("content") || null,
    ogTitle: $('meta[property="og:title"]').attr("content") || null,
    ogDescription: $('meta[property="og:description"]').attr("content") || null
  };

  return {
    selector_text: textResult,
    images,
    videos,
    links,
    metadata
  };
}

// Helper: fix relative URLs
function resolveUrl(base, relative) {
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}
