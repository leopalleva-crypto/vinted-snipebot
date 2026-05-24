import axios from "axios";

const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function sendMessage() {
  try {
    await axios.post(WEBHOOK_URL, {
      embeds: [
        {
          title: "🐊 Neuer Lacoste Sweater gefunden",
          description: "Vintage Lacoste Sweater • 20€ • Größe L",
          color: 65340,
          footer: {
            text: "PURE Snipebot"
          }
        }
      ]
    });

    console.log("Nachricht gesendet!");
  } catch (err) {
    console.error(err);
  }
}

sendMessage();
