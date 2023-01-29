process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

import axios from "axios";
import fs from "fs";
import { sleep } from "../utils";
const FormData = require("form-data");

const base_headers = {
  Origin: "https://imgupscaler.com",
  Referer: "https://imgupscaler.com/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
};

async function makeScaleImageRequest(
  img_path: string,
  scale: number
): Promise<string> {
  const data = new FormData();
  data.append("myfile", fs.createReadStream(img_path));
  data.append("scaleRadio", scale.toString());

  const headers = {
    ...base_headers,
    ...data.getHeaders(),
  };

  const response = await axios.post(
    "https://access.imglarger.com:8998/upload",
    data,
    { headers: headers }
  );
  return response.data;
}

async function getStatus(image_id: string): Promise<string> {
  const response = await axios.get(
    `https://access.imglarger.com:8998/status/${image_id}`,
    {
      headers: base_headers,
    }
  );
  return response.data;
}

async function pollStatus(image_id: string): Promise<boolean> {
  const status = await getStatus(image_id);
  if (status !== "success") {
    await sleep(4000);
    return pollStatus(image_id);
  }
  return true;
}

async function scaleImage(img_path: string, scale: number): Promise<string> {
  const image_id = await makeScaleImageRequest(img_path, 4);

  await pollStatus(image_id);
  const url = `http://get2.imglarger.com:8889/results/${image_id}_${scale}x.jpg`;
  return url;
}

export { scaleImage };
