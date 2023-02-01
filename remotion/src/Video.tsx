import { Composition, getInputProps } from "remotion";
import React from "react";
import { HoroscopeComponent } from "./Horoscope";
import "./style.css";

export const RemotionVideo = () => {
  const { sign } = getInputProps();
  // const sign = "aries";
  const horoscopeWithSubtitles = require(`../../output/subtitles/${sign}.json`);

  const video_duration: any =
    horoscopeWithSubtitles?.subtitles[
      horoscopeWithSubtitles.subtitles.length - 1
    ].to;

  return (
    <Composition
      id="Horoscope"
      component={HoroscopeComponent}
      durationInFrames={24 * Math.round(video_duration + 3)}
      fps={24}
      height={1080}
      width={1920}
      defaultProps={{
        horoscopeWithSubtitles,
      }}
    />
  );
};
