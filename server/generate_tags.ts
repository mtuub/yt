import { Horoscope, Tag } from "./types";
import fs from "fs/promises";
import { retrieveVideoTags } from "./services/tags";

(async () => {
  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const save_dir = "output/tags";
  try {
    await fs.mkdir(save_dir, { recursive: true });
  } catch (error) {}

  for (let idx = 0; idx < horoscopes.length; idx++) {
    const horoscope = horoscopes[idx];

    const title = `${horoscope.sign} Horoscope ${horoscope.date}`;

    const tags = await retrieveVideoTags(title);

    const sign_tag: Tag = {
      sign: horoscope.sign,
      tags,
    };
    await fs.writeFile(
      `${save_dir}/${horoscope.sign}.json`,
      JSON.stringify(sign_tag)
    );
  }
})();
