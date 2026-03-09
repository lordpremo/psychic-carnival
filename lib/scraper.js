import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeWebsite(url, selector) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
    },
    timeout: 20000
  });

  const html = response.data;
  const $ = cheerio.load(html);

  if (!selector) {
    return $("body").text().trim().slice(0, 1000);
  }

  const results = [];
  $(selector).each((i, el) => {
    const text = $(el).text().trim();
    if (text) results.push(text);
  });

  return results.length ? results : `No elements found for selector: ${selector}`;
    }
