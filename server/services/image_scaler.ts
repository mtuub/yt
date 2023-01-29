import axios from "axios";
import { writeFile } from "fs/promises";
import { sleep } from "../utils";

require("dotenv").config();

async function createDeployment(): Promise<string> {
  const response = await axios.post(
    "https://api.vercel.com/v13/deployments?forceNew=1",
    {
      name: "image-scaler-api",
      deploymentId: "dpl_Djhi1viVdTmrwM7pw9xumrg46kw8",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
    }
  );
  return `https://${response.data.url}`;
}

async function scaleImage(
  url: string,
  scale: number,
  save_path: string,
  deploy_url: string
): Promise<void> {
  const response = await axios.post(
    deploy_url,
    {
      url,
      scale,
    },
    { responseType: "arraybuffer" }
  );
  await writeFile(save_path, response.data);
}

async function pollDeployment(deploy_url: string): Promise<void> {
  const response = await axios.get(deploy_url);
  if (response.data === "Image scaler API is running") {
    return;
  } else {
    await sleep(3000);
    await pollDeployment(deploy_url);
  }
}

export { createDeployment, scaleImage, pollDeployment };
