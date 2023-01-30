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
    await fs.mkdir(`output/scaled_images`, { recursive: true });
  } catch (error) {}

  const sentences = horoscope.subtitles.map((s) => s.sentence);

  for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
    const sentence = sentences[sIdx];
    const video_thumbnails = await getVideoThumbnails(sentence);

    const image_path = `output/images/${sign}_${sIdx}.jpg`;

    await downloadFile({
      file_url: video_thumbnails[0],
      save_path: image_path,
    });

    const out_path = `output/scaled_images/${sign}_${sIdx}_scaled.jpg`;

    await scaleImage(image_path, out_path);

    console.log(
      `Generated ${sIdx}/${sentences.length} images for ${horoscope.horoscope.sign}`
    );
  }
})();
