import fs from "fs/promises";
import { Horoscope, HoroscopeWithSubtitles, SubtitleData } from "./types";
import { createSubtitlesForAudio } from "./services/subtitles";
import { getVideoSuggestion } from "./services/video_search";

(async () => {
  const sign = process.argv[2].toLowerCase();

  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const sign_horoscope = horoscopes.find((h) => h.sign === sign);

  const subtitles: SubtitleData[] = await createSubtitlesForAudio(
    `output/audios/${sign}.mp3`
  );

  // Get video suggestions
  for (let idx = 0; idx < subtitles.length; idx++) {
    const subtitle = subtitles[idx];

    let sentence = subtitle.sentence.toLowerCase();

    sentence = sentence.replace("regarding career, ", "");
    sentence = sentence.replace("regarding health, ", "");
    sentence = sentence.replace("regarding love, ", "");
    sentence = sentence.replace(sign, "");

    let video_url;
    try {
      video_url = await getVideoSuggestion(sentence);
      if (!video_url) throw new Error("No video found");
    } catch (error) {
      video_url = await getVideoSuggestion(sign);
    }
    subtitle.video_url = video_url;
    console.log(`Video retrieved: ${idx} / ${subtitles.length} done.`);
  }

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
