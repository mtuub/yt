import { Subtitle } from "./services/subtitles";

export interface Horoscope {
  sign: string;
  horoscope: string;
  date: string;
  subtitles: Subtitle[];
}

export interface OverdubResponse {
  id: string;
  state: string;
}

export interface TrimToSentenceData {
  text: string;
  sentence_count: number;
}
