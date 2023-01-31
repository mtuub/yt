import axios from "axios";
import { getUserAgent } from "../utils";
import fs from "fs/promises";
require("dotenv").config();

const headers = {
  "user-agent": getUserAgent(),
  origin: "https://app.pictory.ai",
  referer: "https://app.pictory.ai/",
};
const baseUrl = "https://api.pictory.ai/asset-search/api/v2";
const pictory_token_path = "assets/pictory_id_token.txt";

async function fetchVideoThumbnails(
  query: string,
  id_token: string
): Promise<string[]> {
  const response = await axios.get(
    `${baseUrl}/videos/premium/search?keywords=${query}&aspectratio=horizontal&page=1`,
    { headers: { ...headers, authorization: `Bearer ${id_token}` } }
  );
  return response.data[0].data.map((x) => x.preview_jpg);
}

async function getKeywordSuggestions(
  sentence: string,
  id_token: string
): Promise<string[]> {
  const response = await axios.post(
    `${baseUrl}/keywords/suggestion`,
    {
      sentence,
    },
    { headers: { ...headers, authorization: `Bearer ${id_token}` } }
  );
  return response.data;
}

async function getVideoThumbnails(sentence: string): Promise<string[]> {
  const id_token = await getIdToken();

  const video_thumbnails = await fetchVideoThumbnails(sentence, id_token);
  return video_thumbnails;
}

async function refreshPictoryToken(): Promise<void> {
  const data = {
    ClientId: process.env.PICTORY_CLIENT_ID,
    AuthFlow: "REFRESH_TOKEN_AUTH",
    AuthParameters: {
      REFRESH_TOKEN: process.env.PICTORY_REFRESH_TOKEN,
      DEVICE_KEY: null,
    },
  };

  const response = await axios.post(
    `https://cognito-idp.us-east-2.amazonaws.com/`,
    data,
    {
      headers: {
        ...headers,
        "content-type": "application/x-amz-json-1.1",
        "x-amz-user-agent": "aws-amplify/5.0.4 js",
        "x-amz-target": "AWSCognitoIdentityProviderService.InitiateAuth",
      },
    }
  );
  const id_token = response.data.AuthenticationResult.IdToken;
  await fs.writeFile(pictory_token_path, id_token);
}

async function getIdToken(): Promise<string> {
  const id_token = await fs.readFile(pictory_token_path, "utf-8");
  return id_token;
}

export { getVideoThumbnails, refreshPictoryToken };
