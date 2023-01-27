export interface Horoscope {
  sign: string;
  horoscope: string;
  date: string;
}

export interface OverdubResponse {
  id: string;
  state: string;
}

export interface TrimToSentenceData {
  text: string;
  sentence_count: number;
}

export interface SubtitleData {
  sentence: string;
  from: number;
  to: number;
  sub_sentences: SubSentence[];
}

export interface SubSentence {
  text: string;
  words_alignment: SubtitleWord[];
}

export interface SubtitleWord {
  from: number;
  to: number;
  value: string;
}

export interface HoroscopeWithSubtitles {
  horoscope: Horoscope;
  subtitles: SubtitleData[];
}
