import { Horoscope, Tag } from "./types";
import fs from "fs/promises";
import { retrieveVideoTags } from "./services/tags";

(async () => {
  const sign = process.argv[2].toLowerCase();

  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );
  const sign_horoscope = horoscopes.find((h) => h.sign === sign);

  const save_dir = "output/tags";
  try {
    await fs.mkdir(save_dir, { recursive: true });
  } catch (error) {}

  const title = `${sign_horoscope.sign} Horoscope ${sign_horoscope.date}`;

  const tags = await retrieveVideoTags(title);

  const sign_tag: Tag = {
    sign: sign_horoscope.sign,
    tags,
  };
  await fs.writeFile(
    `${save_dir}/${sign_horoscope.sign}.json`,
    JSON.stringify(sign_tag)
  );
})();
