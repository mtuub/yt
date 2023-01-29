import axios from "axios";
import fs from "fs/promises";
import {
  createDeployment,
  pollDeployment,
  scaleImage,
} from "./services/image_scaler";
import { getVideoThumbnails } from "./services/pictory";
import { HoroscopeWithSubtitles } from "./types";
import { downloadFile } from "./utils";

(async () => {
  const horoscopes: HoroscopeWithSubtitles[] = JSON.parse(
    await fs.readFile("output/horoscope_with_subtitles.json", "utf-8")
  );

  try {
    await fs.mkdir(`output/images`, { recursive: true });
    await fs.mkdir(`output/scaled_images`, { recursive: true });
  } catch (error) {}

  for (let idx = 0; idx < horoscopes.length; idx++) {
    const horoscope = horoscopes[idx];
    const sign = horoscope.horoscope.sign;

    const sentences = horoscope.subtitles.map((s) => s.sentence);
    let total_images = 0;

    let deploy_url = "";

    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
      const sentence = sentences[sIdx];
      const video_thumbnails = await getVideoThumbnails(sentence);

      const image_path = `output/images/${sign}_${sIdx}.jpg`;

      await downloadFile({
        file_url: video_thumbnails[0],
        save_path: image_path,
      });

      if (total_images % 8 === 0) {
        deploy_url = await createDeployment();
        await pollDeployment(deploy_url);
        console.log("Deployment ready", deploy_url);
      }

      const out_path = `output/scaled_images/${sign}_${sIdx}_scaled.jpg`;
      await scaleImage(
        video_thumbnails[0],
        2,
        out_path,
        `${deploy_url}/scale-image`
      );
      total_images++;
      console.log(
        `Generated ${sIdx}/${sentences.length} images for ${horoscope.horoscope.sign}`
      );
    }
  }
})();
