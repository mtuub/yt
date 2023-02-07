import fs from "fs/promises";
import { getYTCookies } from "./services/horoscope";
import { Horoscope, Tag } from "./types";
const glob = require("glob");
import { upload, comment } from "youtube-videos-uploader";
require("dotenv").config();

(async () => {
  const sign = process.argv[2].toLowerCase();

  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const horoscope = horoscopes.find((h) => h.sign === sign);

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

  const video_datas = [];

  const tag: Tag = JSON.parse(
    await fs.readFile(`output/tags/${horoscope.sign}.json`, "utf-8")
  );

  const capitalized =
    horoscope.sign.charAt(0).toUpperCase() + horoscope.sign.slice(1);
  const data = {
    path: `output/videos/${horoscope.sign}.mp4`,
    thumbnail: `output/thumbnails/${horoscope.sign}.png`,
    title: `${capitalized} Horoscope - ${horoscope.date}`,
    // tags: tag,
    description: `Manifest Love & Money 2023: ${
      process.env.AFFLIATE_LINK
    } \n\nTags: (${tag.tags.join(", ")})`,
    isNotForKid: true,
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
      }).then((urls) => {
        console.log(`Uploaded videos`);
        // // comment after 1 minute
        // setTimeout(() => {
        //   const comments = [
        //     {
        //       link: urls[0],
        //       comment: `Manifest Love & Money Instantly: ${process.env.AFFLIATE_LINK}`,
        //       pin: true,
        //     },
        //   ];

        //   comment(credentials, [...comments]).then((_) =>
        //     console.log(`Commented on video for ${video_data.title}`)
        //   );
        // }, 60000);
      });
    }
  );
})();
