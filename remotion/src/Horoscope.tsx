import React from "react";
import { AbsoluteFill, Audio, Video, Series, useVideoConfig } from "remotion";
import { HoroscopeWithSubtitles } from "./types";
import { splitStringToWord } from "./utils";
import { VideoProgress } from "./VideoProgress";

export const HoroscopeComponent = (props) => {
  const videoConfig = useVideoConfig();

  const horoscope_with_subtitles_and_images: HoroscopeWithSubtitles =
    props.horoscopeWithSubtitles;

  const video_duration =
    horoscope_with_subtitles_and_images.subtitles[
      horoscope_with_subtitles_and_images.subtitles.length - 1
    ].to;
  return (
    <AbsoluteFill>
      <Audio src={require(`../../aries.mp3`)} />
      {/* <Audio
        src={require(`../../output/audios/${horoscope_with_subtitles_and_images.horoscope.sign}.mp3`)}
      /> */}

      <Series>
        {horoscope_with_subtitles_and_images.subtitles.map((subtitle, sIdx) => {
          return (
            <Series.Sequence
              from={Math.floor(subtitle.from * videoConfig.fps)}
              durationInFrames={Math.floor(
                sIdx ===
                  horoscope_with_subtitles_and_images.subtitles.length - 1
                  ? video_duration
                  : (horoscope_with_subtitles_and_images.subtitles[sIdx + 1]
                      .from -
                      subtitle.from) *
                      videoConfig.fps
              )}
            >
              <Video
                height={videoConfig.height}
                width={videoConfig.width}
                src={subtitle.video_url}
              />

              <Series>
                {subtitle.sub_sentences.map((sub_sentence, ssIdx) => {
                  return sub_sentence.words_alignment.map(
                    (word_alignment, waIdx) => {
                      const sentence = sub_sentence.words_alignment
                        .slice(0, waIdx + 1)
                        .map((wa) => wa.value)
                        .join(" ");

                      const h3_sentences = splitStringToWord(sentence, 40);

                      return (
                        <Series.Sequence
                          durationInFrames={Math.floor(
                            (word_alignment.to - word_alignment.from) *
                              videoConfig.fps
                          )}
                        >
                          <AbsoluteFill
                            style={{
                              top: "75%",
                              width: "70%",
                              left: "22%",
                            }}
                          >
                            {h3_sentences.map((h3_sentence, idx) => {
                              return (
                                <h3
                                  style={{
                                    color: "#FFFF04",
                                    fontSize: 60,
                                    margin: "0",
                                    marginBottom: "10px",
                                    // textAlign: "center",
                                    backgroundColor: "rgba(0,0,0,0.8)",
                                    padding: "10px 15px",
                                    width: "fit-content",
                                    maxWidth: "100%",
                                  }}
                                >
                                  {h3_sentence}
                                </h3>
                              );
                            })}
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

        <Series.Sequence
          from={Math.floor(
            (horoscope_with_subtitles_and_images.subtitles[
              horoscope_with_subtitles_and_images.subtitles.length - 1
            ].to +
              0.5) *
              videoConfig.fps
          )}
          durationInFrames={3 * videoConfig.fps}
        >
          <AbsoluteFill
            style={{
              top: "15%",
              textAlign: "center",
            }}
          >
            <h1 style={{ color: "#FFFD04", fontSize: "100px" }}>
              Manifest Your Dream Life
            </h1>
            <h1 style={{ color: "#FFFD04", fontSize: "100px" }}>
              Attract Money, Love & Success
            </h1>
            <h1 style={{ color: "#FFF", fontSize: "100px" }}>Link in Bio</h1>
          </AbsoluteFill>
        </Series.Sequence>
      </Series>
      <AbsoluteFill>
        <VideoProgress duration={videoConfig.durationInFrames} />
      </AbsoluteFill>

      <h3>Subscribe!</h3>
    </AbsoluteFill>
  );
};
