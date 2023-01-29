import React from "react";
import { AbsoluteFill, Audio, Img, Series, useVideoConfig } from "remotion";
import { HoroscopeWithSubtitles } from "./types";

export const HoroscopeComponent: React.FC = (props) => {
  const videoConfig = useVideoConfig();

  const horoscope_with_subtitles_and_images: HoroscopeWithSubtitles =
    props.horoscopeWithSubtitles;

  return (
    <AbsoluteFill>
      <Audio
        src={require(`../../output/${horoscope_with_subtitles_and_images.horoscope.sign}.mp3`)}
      />

      <Series>
        {horoscope_with_subtitles_and_images.subtitles.map((subtitle, sIdx) => {
          return (
            <Series.Sequence
              durationInFrames={Math.round(
                (subtitle.to - subtitle.from) * videoConfig.fps
              )}
            >
              <Img
                height={videoConfig.height}
                width={videoConfig.width}
                src={`${horoscope_with_subtitles_and_images.subtitles[sIdx].image_url}`}
              />

              <Series>
                {subtitle.sub_sentences.map((sub_sentence, ssIdx) => {
                  return sub_sentence.words_alignment.map(
                    (word_alignment, waIdx) => {
                      return (
                        <Series.Sequence
                          durationInFrames={Math.round(
                            (word_alignment.to - word_alignment.from) *
                              videoConfig.fps
                          )}
                        >
                          <AbsoluteFill
                            style={{
                              top: "70%",
                              width: "70%",
                              margin: "0 auto",
                              // backgroundColor: "black",
                            }}
                          >
                            <h3
                              style={{
                                color: "white",
                                fontSize: 75,
                                // textAlign: "center",
                              }}
                            >
                              {sub_sentence.words_alignment
                                .slice(0, waIdx + 1)
                                .map((wa) => wa.value)
                                .join(" ")}
                            </h3>
                          </AbsoluteFill>
                          ;
                        </Series.Sequence>
                      );
                    }
                  );
                })}
              </Series>
            </Series.Sequence>
          );
        })}
      </Series>
    </AbsoluteFill>
  );
};
