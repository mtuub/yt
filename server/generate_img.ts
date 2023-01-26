import { AI_CLIENT, getToken } from "./services/ai_image";
import fs from "fs/promises";
import { Horoscope } from "./types";

(async () => {
  const sign = process.argv[2].toLowerCase();

  const horoscope: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope_with_subtitles.json", "utf-8")
  );
  const sign_horoscope = horoscope.find((h) => h.sign.toLowerCase() === sign);

  const sentences = sign_horoscope.subtitles.map((subtitle) => subtitle.text);

  try {
    await fs.mkdir(`output/images`, { recursive: true });
  } catch (error) {}

  // generate images
  const token = await getToken();
  const ai_client = new AI_CLIENT(token);

  for (let idx = 0; idx < sentences.length; idx++) {
    const sentence = sentences[idx];

    await ai_client.generateImageFromText({
      style: 52,
      caption: sentence,
      save_path: `output/images/${sign}_part_${idx}.png`,
    });

    console.log(`Generated image for sentence ${idx + 1} /${sentences.length}`);
  }
})();
