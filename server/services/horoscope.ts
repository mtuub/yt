import axios from "axios";
import { Horoscope } from "../types";
require("dotenv").config();

const api_url = `${process.env.HOROSCOPE_API_URL}:3002`;

async function getHoroscopeTomorrowAllCategories(): Promise<Horoscope[]> {
  const horoscopes: Horoscope[] = (
    await axios.get(`${api_url}/tomorrow-merged`)
  ).data.data;

  return horoscopes.map((h) => {
    return {
      ...h,
      sign: h.sign.toLowerCase(),
      horoscope: h.horoscope.replace("Regarding career, ", ""),
    };
  });
}

export { getHoroscopeTomorrowAllCategories };
