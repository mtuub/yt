import React from "react";
import { Audio, Img, Series, useCurrentFrame, useVideoConfig } from "remotion";

export const HoroscopeComponent: React.FC = ({ horoscope }) => {
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
      <Audio src={require(`../../output/${horoscope.sign}.mp3`)} />

      <Series>
        {horoscope.subtitles.map((subtitle, sIdx) => {
          return (
            <Series.Sequence
              durationInFrames={Math.round(
                (subtitle.to - subtitle.from) * videoConfig.fps
              )}
            >
              <Img
                height={videoConfig.height}
                width={videoConfig.width / 2.3}
                style={{
                  left: 0,
                  top: 0,
                  position: "absolute",
                  zIndex: 3,
                }}
                src={require(`../../output/images/${horoscope.sign}_part_${sIdx}.png`)}
              />

              <Img
                width={videoConfig.width + 200}
                height={videoConfig.height + 200}
                style={{
                  filter: "blur(6rem)",
                  left: -100,
                  top: -100,
                  position: "absolute",
                }}
                src={require(`../../output/images/${horoscope.sign}_part_${sIdx}.png`)}
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
                {subtitle.text}
              </h3>
            </Series.Sequence>
          );
        })}
      </Series>
    </div>
  );
};
