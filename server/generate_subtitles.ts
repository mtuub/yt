import fs from "fs/promises";
import { Horoscope, HoroscopeWithSubtitles, SubtitleData } from "./types";
import { createSubtitlesForAudio } from "./services/subtitles";

(async () => {
  const sign = process.argv[2].toLowerCase();

  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const sign_horoscope = horoscopes.find((h) => h.sign === sign);

  const subtitles: SubtitleData[] = await createSubtitlesForAudio(
    `output/${sign}.mp3`
  );
  const horoscope_with_subtitles: HoroscopeWithSubtitles = {
    horoscope: sign_horoscope,
    subtitles,
  };
  try {
    await fs.mkdir(`output/subtitles`, { recursive: true });
  } catch (error) {}

  await fs.writeFile(
    `output/subtitles/${sign}.json`,
    JSON.stringify(horoscope_with_subtitles)
  );
})();
