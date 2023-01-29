import axios from "axios";

const IdToken =
  "eyJraWQiOiJYQ1I1MGY0UjJEZGhDcmtRMlE5SXlXTVlWNmVraFlkZWhIZXlFWnJuV3BBPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMjhkZTc1OS03NGQzLTRmYjMtOGExMi1hZDgyZDU3YmU1YWEiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0yX3NsVEM5RFlweiIsImNvZ25pdG86dXNlcm5hbWUiOiIyMjhkZTc1OS03NGQzLTRmYjMtOGExMi1hZDgyZDU3YmU1YWEiLCJhdWQiOiIxMHB0M2JvdXRiNTN0YW9zZjQ2OThobW9wdCIsImV2ZW50X2lkIjoiZmY1OWIwOTctYzM2NS00NmJmLWI5NzQtMDczMTBmZjBjNTVmIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NzQ5MDI3ODYsIm5hbWUiOiJ5dXZyYWoiLCJjdXN0b206bGVhZF9zb3VyY2UiOiJPdGhlciIsImV4cCI6MTY3NTAwNTgxMCwiaWF0IjoxNjc1MDAyMjEwLCJlbWFpbCI6Inl1dnJhajEwOGNAZ21haWwuY29tIn0.MnL3zdlfPcv_Wfrm0rR1WsuSzHEosPA2xNHWeYZDL3goie3LA2zABYqJfoSTEFihXqGIMN18XQl-DD6FHiYktjsteqZ7SQBCFTbRZwa-Xk1Fo2ijhmLQF3Wm9PTKE_4Ii8y_s6IZzJgREF4sHhyp_YLTi1waeZSRoXsVRthSFfOwzwiidU-sDJD_Q5EFL8jHAbKGViaR66uu1bpRORqqnz0AdjCIPa9pi9BzOyC_immqLD_U45G9g4r5ibm9zNW0ZSu9kezFzP9DgVMBHzm32ZbiIlqFt6r_m18Bg1aD-oKgMXtga0lMqF7juCLVVX-P_lwkXx6sVcifFERSjXSUbg";
const headers = {
  authorization: IdToken,
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  origin: "https://app.pictory.ai",
  referer: "https://app.pictory.ai/",
};
const baseUrl = "https://api.pictory.ai/asset-search/api/v2";

async function fetchVideoThumbnails(query: string): Promise<string[]> {
  const response = await axios.get(
    `${baseUrl}/videos/premium/search?keywords=${query}&aspectratio=horizontal&page=1`,
    { headers }
  );
  return response.data[0].data.map((x) => x.preview_jpg);
}

async function getKeywordSuggestions(sentence: string): Promise<string[]> {
  const response = await axios.post(
    `${baseUrl}/keywords/suggestion`,
    {
      sentence,
    },
    { headers }
  );
  return response.data;
}

async function getVideoThumbnails(sentence: string): Promise<string[]> {
  // const keywords = await getKeywordSuggestions(sentence);
  const video_thumbnails = await fetchVideoThumbnails(sentence);
  return video_thumbnails;
}

export { getVideoThumbnails };
