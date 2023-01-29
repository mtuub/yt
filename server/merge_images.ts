import fs from "fs/promises";
import { HoroscopeWithSubtitles } from "./types";

(async () => {
  const dir = "output/images_json";
  const file_paths = (await fs.readdir(dir)).map((f) => `${dir}/${f}`);

  const requests = file_paths.map((p) => openJsonFile(p));
  const horoscopes_with_subtitles_img: HoroscopeWithSubtitles[] =
    await Promise.all(requests);

  await fs.writeFile(
    `output/horoscopes_with_subtitles_images.json`,
    JSON.stringify(horoscopes_with_subtitles_img)
  );
  console.log(`Merged all image json in one file`);
})();

async function openJsonFile(path: string): Promise<HoroscopeWithSubtitles> {
  return JSON.parse(await fs.readFile(path, "utf-8"));
}
