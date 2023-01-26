import axios from "axios";
import { generateRandomString, getFileSize, sleep } from "../utils";
import fs from "fs/promises";
import getAudioDurationInSeconds from "get-audio-duration";

interface UploadResponse {
  upload_url: string;
  cdn_url: string;
}

export interface Subtitle {
  from: number;
  to: number;
  text: string;
}

const project_id = "b3384809-e512-4b43-83bb-97fcb6628597";

const headers = {
  origin: "https://www.veed.io",
  referer: "https://www.veed.io/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Content-Type": "application/json",
};

async function createMediaName(media_id: string): Promise<void> {
  const data = JSON.stringify({
    data: {
      edit: {
        mediaSources: {
          [media_id]: {
            displayURL: null,
            onlineURL: "",
            duration: null,
          },
        },
      },
    },
    name: media_id,
  });

  await axios.put(`https://www.veed.io/api/projects/${project_id}`, data, {
    headers,
  });
}

async function getUploadUrlForMp3(
  media_id: string,
  audio_path: string
): Promise<UploadResponse> {
  const audio_size = await getFileSize(audio_path);

  const data = JSON.stringify({
    filename: `${media_id}.mp3`,
    contentSize: audio_size,
    assetType: "AUDIO",
    assetSubType: "SOURCE",
    group: "srcVideo",
    plan: "FREE",
    extension: "mp3",
    mimeType: "audio/mpeg",
    storage: "PERMANENT",
  });

  const response = await axios.post(`https://www.veed.io/api/v1/asset`, data, {
    headers,
  });
  return {
    upload_url: response.data.data.url,
    cdn_url: response.data.data.asset.cdnUrl,
  };
}

async function uploadAudioToVeed(
  upload_url: string,
  audio_path: string
): Promise<void> {
  const audio_data = await fs.readFile(audio_path);
  await axios.put(upload_url, audio_data, {
    headers: {
      ...headers,
      "Content-Type": "audio/mpeg",
    },
  });
}

async function createSubtitles(
  media_id: string,
  cdn_url: string,
  audio_path: string
): Promise<Subtitle[]> {
  const duration = await getAudioDurationInSeconds(audio_path);
  const data = JSON.stringify({
    trimStart: 0,
    trimEnd: duration,
    video_url: cdn_url,
    language_code: "en-US",
    isDefault: true,
    workspaceId: null,
    projectId: project_id,
    language: "en-US",
    videoUrl: cdn_url,
  });

  const transcription = await pollSubtitles(media_id, data);
  const subtitles: any = Object.values(transcription);
  subtitles.sort((a: any, b: any) => a.from - b.from);

  const subtitles_data: Subtitle[] = subtitles.map((s: any) => {
    return {
      text: s.words.map((w) => w.value).join(" "),
      from: s.from,
      to: s.to,
    };
  });
  return subtitles_data;
}

async function pollSubtitles(media_id, data): Promise<any> {
  const response = await axios.post(
    `https://www.veed.io/api/v1/subtitles/assets/${media_id}/transcribe`,
    data,
    { headers }
  );
  const status = response.data.data.status;
  if (status !== "active") {
    await sleep(2000);
    return await pollSubtitles(media_id, data);
  }

  return response.data.data.subtitles;
}

async function createSubtitlesForAudio(
  audio_path: string
): Promise<Subtitle[]> {
  const media_id = generateRandomString(21);
  await createMediaName(media_id);
  const { cdn_url, upload_url } = await getUploadUrlForMp3(
    media_id,
    audio_path
  );
  await uploadAudioToVeed(upload_url, audio_path);
  return await createSubtitles(media_id, cdn_url, audio_path);
}

export { createSubtitlesForAudio };
