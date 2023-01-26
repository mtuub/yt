import React from "react";
import horoscopes from "../../output/horoscope.json";
import { Audio, Img, Series, useCurrentFrame, useVideoConfig } from "remotion";

const sign = "aries";
const sign_horoscope: any = horoscopes.find(
  (x) => x.sign.toLowerCase() === sign.toLowerCase()
);

export const HoroscopeComponent: React.FC = () => {
  const videoConfig = useVideoConfig();
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <Audio src={require(`../../output/${sign}.mp3`)} />

      <Series>
        {sign_horoscope.sentences.map((sentence, sIdx) => {
          const sentence_duration_in_sec =
            sign_horoscope.sentences_duration_in_sec[sIdx];

          const durationInFrames = Math.floor(
            videoConfig.fps * sentence_duration_in_sec
          );

          const elapsedSentencesDurationInSec =
            sign_horoscope.sentences_duration_in_sec
              .slice(0, sIdx)
              .reduce((a: any, b: any) => a + b, 0);
          const elapsedFrames = Math.floor(
            elapsedSentencesDurationInSec * videoConfig.fps
          );
          const progress = (frame - elapsedFrames) / durationInFrames;
          const characters_to_Show = Math.floor(
            sign_horoscope.sentences[sIdx].length * progress
          );

          return (
            <Series.Sequence durationInFrames={durationInFrames}>
              <Img
                height={videoConfig.height}
                width={videoConfig.width / 2.3}
                style={{
                  left: 0,
                  top: 0,
                  position: "absolute",
                  zIndex: 3,
                }}
                src={require(`../../output/images/${sign}_part_${sIdx}.png`)}
              />

              {/* background image */}
              <Img
                width={videoConfig.width + 200}
                height={videoConfig.height + 200}
                style={{
                  filter: "blur(6rem)",
                  left: -100,
                  top: -100,
                  position: "absolute",
                }}
                src={require(`../../output/images/${sign}_part_${sIdx}.png`)}
              />
              <h3
                style={{
                  color: "white",
                  position: "absolute",
                  top: "20%",
                  left: "50%",
                  fontSize: 60,
                  letterSpacing: 5,
                  width: 800,
                  zIndex: 1,
                }}
              >
                {sentence.slice(0, characters_to_Show)}
              </h3>
            </Series.Sequence>
          );
        })}
      </Series>
    </div>
  );
};
