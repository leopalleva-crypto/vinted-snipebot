import axios from "axios";

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const VINTED_COOKIE = process.env.VINTED_COOKIE;

const VINTED_DOMAINS = [
  "https://www.vinted.de",
  "https://www.vinted.it",
  "https://www.vinted.nl",
  "https://www.vinted.be",
  "https://www.vinted.fr"
];

const SEARCHES = [
  "lacoste sweater",
  "lacoste pull",
  "lacoste knit",
  "lacoste crewneck",
  "lacoste jumper"
];

const INTERVAL = 60 * 1000;

let seenItems = new Set();

async function searchVinted() {
  for (const domain of VINTED_DOMAINS) {
    for (const search of SEARCHES) {
      try {
        const url = `${domain}/api/v2/catalog/items?search_text=${encodeURIComponent(
          search
        )}&order=newest_first&per_page=20`;

        const res = await axios.get(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",

            "Accept": "application/json, text/plain, */*",

            "Accept-Language": "de-DE,de;q=0.9",

            "Origin": domain,

            "Referer": `${domain}/catalog`,

            "Cookie": VINTED_COOKIE,

            "Cache-Control": "no-cache",

            "Pragma": "no-cache",

            "Sec-Ch-Ua":
              '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',

            "Sec-Ch-Ua-Mobile": "?0",

            "Sec-Ch-Ua-Platform": '"Windows"',

            "Sec-Fetch-Dest": "empty",

            "Sec-Fetch-Mode": "cors",

            "Sec-Fetch-Site": "same-origin"
          }
        });

        const items = res.data.items || [];

        for (const item of items) {
          const uniqueId = `${domain}-${item.id}`;

          if (seenItems.has(uniqueId)) continue;
          seenItems.add(uniqueId);

          await axios.post(WEBHOOK_URL, {
            embeds: [
              {
                title: `🐊 ${item.title}`,
                url: item.url,
                description:
                  `🌍 Land: ${domain.replace("https://www.vinted.", "").toUpperCase()}\n` +
                  `💸 Preis: ${item.price} ${item.currency}\n` +
                  `📏 Größe: ${item.size_title || "Keine Angabe"}\n` +
                  `🎨 Farbe: ${item.colour_title || "Keine Angabe"}`,

                color: 65340,

                image: {
                  url: item.photo?.url
                },

                footer: {
                  text: "PURE Lacoste Snipebot"
                }
              }
            ]
          });

          console.log("Neuer Artikel:", item.title);
        }
      } catch (error) {
        console.error(
          `Fehler bei ${domain}:`,
          error.response?.status || error.message
        );
      }
    }
  }
}

console.log("PURE Lacoste Snipebot läuft...");

searchVinted();

setInterval(searchVinted, INTERVAL);
