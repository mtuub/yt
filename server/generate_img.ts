import fs from "fs/promises";
import { scaleImage } from "./services/image_scaler";
import { getVideoThumbnails } from "./services/pictory";
import { HoroscopeWithSubtitles } from "./types";
import { downloadFile } from "./utils";

(async () => {
  const horoscopes: HoroscopeWithSubtitles[] = JSON.parse(
    await fs.readFile("output/horoscope_with_subtitles.json", "utf-8")
  );

  const sign = process.argv[2].toLowerCase();
  const horoscope = horoscopes.find((h) => h.horoscope.sign === sign);

  try {
    await fs.mkdir(`output/images`, { recursive: true });
    await fs.mkdir(`output/images_json`, { recursive: true });
  } catch (error) {}

  const sentences = horoscope.subtitles.map((s) => s.sentence);

  const horoscope_with_subtitles_img: HoroscopeWithSubtitles[] = [];

  for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
    const sentence = sentences[sIdx];
    const video_thumbnails = await getVideoThumbnails(sentence);

    const image_path = `output/images/${sign}_${sIdx}.jpg`;

    await downloadFile({
      file_url: video_thumbnails[0],
      save_path: image_path,
    });

    const upscaled_img_url = await scaleImage(image_path, 4);
    horoscope.subtitles[sIdx].image_url = upscaled_img_url;
    horoscope_with_subtitles_img.push(horoscope);
    console.log(
      `Generated ${sIdx}/${sentences.length} images for ${horoscope.horoscope.sign}`
    );
  }

  await fs.writeFile(
    `output/images_json/${sign}.json`,
    JSON.stringify(horoscope_with_subtitles_img[0]),
    "utf-8"
  );
})();
