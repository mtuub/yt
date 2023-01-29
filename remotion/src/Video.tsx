import { Composition } from "remotion";
import React from "react";
import { HoroscopeComponent } from "./Horoscope";
import horoscopes from "../../output/horoscope_with_subtitles_and_images.json";
import "./style.css";

export const RemotionVideo: React.FC = () => {
  const sign = "aries";
  const horoscopeWithSubtitles = horoscopes.find(
    (h) => h.horoscope.sign === sign
  );
  const video_duration: any =
    horoscopeWithSubtitles?.subtitles[
      horoscopeWithSubtitles.subtitles.length - 1
    ].to;

  return (
    <Composition
      id="Horoscope"
      component={HoroscopeComponent}
      durationInFrames={24 * Math.round(video_duration)}
      fps={24}
      height={1080}
      width={1920}
      defaultProps={{
        horoscopeWithSubtitles,
      }}
    />
  );
};
