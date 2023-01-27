import fs from "fs/promises";
import { HoroscopeWithSubtitles } from "./types";

(async () => {
  const dir = "output/subtitles";
  const file_paths = (await fs.readdir(dir)).map((f) => `${dir}/${f}`);

  const requests = file_paths.map((p) => openSubtitleFile(p));
  const horoscopes_with_subtitles: HoroscopeWithSubtitles[] = (
    await Promise.all(requests)
  ).flat();

  await fs.writeFile(
    `output/horoscope_with_subtitles.json`,
    JSON.stringify(horoscopes_with_subtitles)
  );
  console.log(`Merged all subtitles in one file`);
})();

async function openSubtitleFile(path: string): Promise<HoroscopeWithSubtitles> {
  return JSON.parse(await fs.readFile(path, "utf-8"));
}
