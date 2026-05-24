import axios from "axios";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

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
  try {
    for (const SEARCH of SEARCHES) {
      const url = `https://www.vinted.ch/api/v2/catalog/items?search_text=${encodeURIComponent(
        SEARCH
      )}&order=newest_first&per_page=20`;

      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const items = res.data.items || [];

      for (const item of items) {
        if (seenItems.has(item.id)) continue;
        seenItems.add(item.id);

        await axios.post(WEBHOOK_URL, {
          embeds: [
            {
              title: `🐊 ${item.title}`,
              url: item.url,
              description:
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
    }
  } catch (error) {
    console.error(error.message);
  }
}

console.log("PURE Snipebot läuft...");

searchVinted();

setInterval(searchVinted, INTERVAL);
