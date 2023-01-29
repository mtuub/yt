import axios from "axios";
import { writeFile } from "fs/promises";
const FormData = require("form-data");

const fs = require("fs");

async function scaleImage(
  img_path: string,
  scale: number,
  save_path: string
): Promise<void> {
  const data = new FormData();
  data.append("image", fs.createReadStream(img_path));
  data.append("scale", scale.toString());
  const headers = {
    Origin: "https://create.pixelcut.ai",
    Referer: "https://create.pixelcut.ai/",
    "x-client-version": "web",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    ...data.getHeaders(),
  };
  const response = await axios.post(
    "https://api2.pixelcut.app/image/upscale/v1",
    data,
    {
      headers,
      responseType: "arraybuffer",
    }
  );

  await writeFile(save_path, response.data);
}

export { scaleImage };
