import fs from "fs/promises";
import { Horoscope, HoroscopeWithSubtitles, SubtitleData } from "./types";
import { createSubtitlesForAudio } from "./services/subtitles";

(async () => {
  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const horoscope_with_subtitles: HoroscopeWithSubtitles[] = [];

  for (let idx = 0; idx < horoscopes.length; idx++) {
    const horoscope = horoscopes[idx];
    const subtitles: SubtitleData[] = await createSubtitlesForAudio(
      `output/${horoscope.sign}.mp3`
    );
    const horoscope_with_subtitle: HoroscopeWithSubtitles = {
      horoscope,
      subtitles,
    };
    horoscope_with_subtitles.push(horoscope_with_subtitle);
  }

  await fs.writeFile(
    `output/horoscope_with_subtitles.json`,
    JSON.stringify(horoscope_with_subtitles)
  );
})();
