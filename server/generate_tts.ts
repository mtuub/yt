import fs from "fs/promises";
import convertTTS from "./services/tts";
import { Horoscope } from "./types";

(async () => {
  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const save_dir = "output/audios";
  try {
    await fs.mkdir(save_dir, { recursive: true });
  } catch (error) {}

  for (let idx = 0; idx < horoscopes.length; idx++) {
    const horoscope = horoscopes[idx];

    await convertTTS(horoscope.horoscope, `${save_dir}/${horoscope.sign}.mp3`);
    console.log(
      `Generated audio for ${horoscope.sign} (${idx + 1}/${horoscopes.length})`
    );
    break; // TODO: remove
  }
})();
