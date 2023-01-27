import fs from "fs/promises";
import { Horoscope, HoroscopeWithSubtitles } from "./types";
import { createSubtitlesForAudio } from "./services/subtitles";

(async () => {
  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const subtitles_requests = horoscopes.map((horoscope) =>
    createSubtitlesForAudio(`output/${horoscope.sign.toLowerCase()}.mp3`)
  );
  const subtitles = await Promise.all(subtitles_requests);

  const horoscopes_with_subtitles: HoroscopeWithSubtitles[] = horoscopes.map(
    (horoscope, idx) => {
      return {
        horoscope,
        subtitles: subtitles[idx],
      };
    }
  );

  await fs.writeFile(
    "output/horoscope_with_subtitles.json",
    JSON.stringify(horoscopes_with_subtitles)
  );
})();
