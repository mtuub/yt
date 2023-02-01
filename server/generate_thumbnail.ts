import { Horoscope } from "./types";
import fs from "fs/promises";
import sharp from "sharp";

(async () => {
  const sign = process.argv[2].toLowerCase();

  const width = 1280;
  const height = 720;

  const horoscopes: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );
  const date_arr = horoscopes[0].date.split(" ");
  const svgImage = `
      <svg width="${width}" height="${height}" fill="#000">
        <style>
        svg {color: black}
        .title { fill: yellow; font-size: 140px; font-weight: bolder;}
        .sign { fill: black; font-size: 90px; font-weight: bolder;}
        </style>
        <text x="4%" y="20%" class="title">${date_arr[0]}</text>
        <text x="4%" y="42%" class="title">${date_arr[1]}</text>
        <text x="4%" y="64%" class="title">${date_arr[2]}</text>
        <text x="4%" y="89%" class="sign">${sign.toUpperCase()}</text>
      </svg>
      `;
  const svgBuffer = Buffer.from(svgImage);

  const save_dir = "output/thumbnails";
  try {
    await fs.mkdir(save_dir, { recursive: true });
  } catch (error) {}

  await sharp("assets/thumbnail.png")
    .composite([{ input: svgBuffer }])
    .toFile(`${save_dir}/${sign}.png`);
})();
