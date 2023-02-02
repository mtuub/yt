import { Horoscope, Tag } from "./types";
import fs from "fs/promises";
import { retrieveVideoTags } from "./services/tags";

(async () => {
  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const sign_tags: Tag[] = [];

  for (let idx = 0; idx < horoscopes.length; idx++) {
    const horoscope = horoscopes[idx];
    const title = `${horoscope.sign} Horoscope ${horoscope.date}`;

    const tags = await retrieveVideoTags(title);

    const sign_tag: Tag = {
      sign: horoscope.sign,
      tags,
    };
    sign_tags.push(sign_tag);
  }
  await fs.writeFile(`output/tags.json`, JSON.stringify(sign_tags));
})();
