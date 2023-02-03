import fs from "fs/promises";
import { getYTCookies } from "./services/horoscope";
import { Horoscope, Tag } from "./types";
const glob = require("glob");
import { upload } from "youtube-videos-uploader";
require("dotenv").config();

(async () => {
  const sign = process.argv[2].toLowerCase();

  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const sign_horoscope = horoscopes.find((h) => h.sign === sign);
  //   retrieve yt cookies from api
  try {
    await fs.mkdir(`yt-auth`, { recursive: true });
  } catch (error) {}

  const cookies = await getYTCookies();
  const cookiesName = `cookies-${process.env.YT_EMAIL.replace("@", "-").replace(
    ".",
    "_"
  )}.json`;
  await fs.writeFile(`yt-auth/${cookiesName}`, JSON.stringify(cookies));

  const tag: Tag = JSON.parse(
    await fs.readFile(`output/tags/${sign}.json`, "utf-8")
  );
  const video_datas = [];

  const capitalized =
    sign_horoscope.sign.charAt(0).toUpperCase() + sign_horoscope.sign.slice(1);
  const data = {
    path: `output/videos/${sign_horoscope.sign}.mp4`,
    thumbnail: `output/thumbnails/${sign_horoscope.sign}.png`,
    title: `${capitalized} Horoscope - ${sign_horoscope.date}`,
    // tags: tag,
    description: `Manifest Love & Money 2023: ${
      process.env.AFFLIATE_LINK
    } \n\nTags: (${tag.tags.join(", ")})`,
  };
  video_datas.push(data);

  const credentials: any = {
    email: process.env.YT_EMAIL,
    pass: "process.env.YT_PASSWORD",
  };

  // Upload video
  glob(
    // "node_modules/puppeteer/.local-chromium/**/chrome-win/chrome.exe",
    "node_modules/puppeteer/.local-chromium/**/chrome-linux/chrome",
    function (er, file_path) {
      upload(credentials, video_datas, {
        executablePath: file_path[0],
        // headless: false,
      }).then();
    }
  );
})();
