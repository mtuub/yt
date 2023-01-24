import axios from "axios";
import { Horoscope } from "../types";
import { trimToSentence } from "../utils";
require("dotenv").config();

const api_url = `${process.env.HOROSCOPE_API_URL}:3002`;

async function getHoroscopeTomorrowGeneral(): Promise<Horoscope[]> {
  let horoscopes: Horoscope[] = (await axios.get(`${api_url}/tomorrow-general`))
    .data.data;
  horoscopes = horoscopes.map((h) => {
    return {
      ...h,
      horoscope: trimToSentence(`In short, ${h.horoscope}`, 500),
    };
  });

  return horoscopes;
}

async function getHoroscopeTomorrowLove(): Promise<Horoscope[]> {
  let horoscopes: Horoscope[] = (await axios.get(`${api_url}/tomorrow-love`))
    .data.data;
  horoscopes = horoscopes.map((h) => {
    return {
      ...h,
      horoscope: trimToSentence(`Regarding love, ${h.horoscope}`, 500),
    };
  });

  return horoscopes;
}

async function getHoroscopeTomorrowCareer(): Promise<Horoscope[]> {
  let horoscopes: Horoscope[] = (await axios.get(`${api_url}/tomorrow-career`))
    .data.data;
  horoscopes = horoscopes.map((h) => {
    return {
      ...h,
      horoscope: trimToSentence(`Regarding career, ${h.horoscope}`, 500),
    };
  });

  return horoscopes;
}

async function getHoroscopeTomorrowWellness(): Promise<Horoscope[]> {
  let horoscopes: Horoscope[] = (
    await axios.get(`${api_url}/tomorrow-wellness`)
  ).data.data;
  horoscopes = horoscopes.map((h) => {
    return {
      ...h,
      horoscope: trimToSentence(`Regarding health, ${h.horoscope}`, 500),
    };
  });

  return horoscopes;
}

export {
  getHoroscopeTomorrowGeneral,
  getHoroscopeTomorrowLove,
  getHoroscopeTomorrowCareer,
  getHoroscopeTomorrowWellness,
};
