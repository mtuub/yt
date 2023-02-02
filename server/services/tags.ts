import axios from "axios";

async function retrieveVideoTags(title: string): Promise<string[]> {
  try {
    const headers = {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
      referer: "https://rapidtags.io/generator/",
    };

    const res = await axios.get(
      `https://rapidtags.io/api/generator?type=YouTube&query=${title}`,
      { headers }
    );
    return res.data["tags"];
  } catch (error) {
    return [];
  }
}

export { retrieveVideoTags };
