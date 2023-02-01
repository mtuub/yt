import axios from "axios";
require("dotenv").config();

const api_url = `${process.env.API_URL}:5600`;

async function getVideoSuggestion(query: string): Promise<string> {
  const response = await axios.get(`${api_url}/search-video?q=${query}`);
  return response.data.url;
}

export { getVideoSuggestion };
