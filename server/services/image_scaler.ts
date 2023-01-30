import axios from "axios";
import fs from "fs/promises";
import { getUserAgent } from "../utils";

async function scaleImage(img_path: string, save_path: string) {
  const imageAsBase64 = await fs.readFile(img_path, "base64");

  const headers = {
    "user-agent": getUserAgent(),
    origin: "https://zyro.com",
    referrer: "https://zyro.com/",
  };
  const data = {
    image_data: imageAsBase64,
  };
  const response = await axios.post(
    `https://upscaler.zyro.com/v1/ai/image-upscaler`,
    data,
    { headers }
  );
  const base64Image = response.data.upscaled.split(";base64,").pop();
  await fs.writeFile(save_path, base64Image, { encoding: "base64" });
}

export { scaleImage };
