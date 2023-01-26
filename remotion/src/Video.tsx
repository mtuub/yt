import { Composition } from "remotion";
import React from "react";
import { HoroscopeComponent } from "./Horoscope";
import horoscopes from "../../output/horoscope.json";
import "./style.css";

export const RemotionVideo: React.FC = () => {
  const sign = "aries";
  const video_duration: any = horoscopes.find(
    (h) => h.sign.toLowerCase() === sign.toLowerCase()
  )?.audio_duration_in_sec;

  return (
    <Composition
      id="Horoscope"
      component={HoroscopeComponent}
      durationInFrames={24 * Math.round(video_duration)}
      fps={24}
      height={1080}
      width={1920}
    />
  );
};
