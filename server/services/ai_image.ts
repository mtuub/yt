import axios from "axios";
import { downloadFile, sleep } from "../utils";

const user_agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36";

class AI_CLIENT {
  http_client: any;
  constructor(token) {
    this.http_client = axios.create({
      baseURL: "https://paint.api.wombo.ai/api",
      headers: {
        origin: "https://www.wombo.art",
        "user-agent": user_agent,
        "x-app-version": "WEB-1.90.1",
        "content-type": "text/plain",
        Authorization: `bearer ${token}`,
      },
    });
  }

  async createTask() {
    const response = await this.http_client.post(`/tasks`, {
      premium: false,
    });
    return response.data.id;
  }

  async configureTask({ task_id, caption, style }) {
    const response = await this.http_client.put(`/tasks/${task_id}`, {
      input_spec: { prompt: caption, style, display_freq: 10 },
    });
    return response.data;
  }

  async pollTaskForUrl({ task_id }) {
    const response = await this.http_client.get(`/tasks/${task_id}`);
    const state = response.data.state;
    // console.log(task_id, state);

    if (state == "failed") {
      return false;
    }
    if (state !== "completed") {
      await sleep(2000);
      return await this.pollTaskForUrl({ task_id });
    }
    return response.data.photo_url_list.pop();
  }

  async generateImageFromText({ style, caption, save_path }) {
    const task_id = await this.createTask();
    await this.configureTask({ task_id, caption, style });

    const image_url = await this.pollTaskForUrl({ task_id });
    if (image_url) {
      await downloadFile({ file_url: image_url, save_path });
    }

    return image_url;
  }
}

async function getToken() {
  const key = `AIzaSyDCvp5MTJLUdtBYEKYWXJrlLzu1zuKM6Xw`;
  const headers: any = {
    origin: "https://www.wombo.art",
    "user-agent": user_agent,
    "x-client-version": "Chrome/JsCore/9.1.2/FirebaseCore-web",
  };
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`,
    {
      returnSecureToken: true,
    },
    headers
  );
  return response.data.idToken;
}

async function getAllStyles() {
  const response = await axios.get(`https://paint.api.wombo.ai/api/styles`, {
    headers: {
      origin: "https://www.wombo.art",
      "user-agent": user_agent,
      "x-app-version": "WEB-1.90.1",
    },
  });
  return response.data;
}

export { AI_CLIENT, getToken, getAllStyles };
