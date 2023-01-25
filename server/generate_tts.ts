import fs from "fs/promises";
import convertTTSDescript from "./services/tts";
import { Horoscope } from "./types";
import { increaseAudioVolume, sleep } from "./utils";

(async () => {
  const sign = process.argv[2].toLowerCase();

  const horoscopes_general: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscopes_general.json", "utf-8")
  );
  const horoscopes_career: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscopes_career.json", "utf-8")
  );
  const horoscopes_love: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscopes_love.json", "utf-8")
  );
  const horoscopes_wellness: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscopes_wellness.json", "utf-8")
  );

  const sign_horoscope_general = horoscopes_general.find(
    (h) => h.sign.toLowerCase() === sign
  );
  const sign_horoscope_career = horoscopes_career.find(
    (h) => h.sign.toLowerCase() === sign
  );
  const sign_horoscope_love = horoscopes_love.find(
    (h) => h.sign.toLowerCase() === sign
  );
  const sign_horoscope_wellness = horoscopes_wellness.find(
    (h) => h.sign.toLowerCase() === sign
  );

  const audio_paths_init = {
    general: `output/${sign}_general_init.mp3`,
    career: `output/${sign}_career_init.mp3`,
    love: `output/${sign}_love_init.mp3`,
    wellness: `output/${sign}_wellness_init.mp3`,
  };

  // generate tts audios in parallel
  const tts_requests = [
    convertTTSDescript(
      sign_horoscope_general.horoscope,
      audio_paths_init.general
    ),
    convertTTSDescript(sign_horoscope_love.horoscope, audio_paths_init.love),
    convertTTSDescript(
      sign_horoscope_wellness.horoscope,
      audio_paths_init.wellness
    ),
    convertTTSDescript(
      sign_horoscope_career.horoscope,
      audio_paths_init.career
    ),
  ];

  await Promise.all(tts_requests);

  // increase volume of audios
  const threshold = 2.5;
  const increase_volume_requests = [
    increaseAudioVolume(
      audio_paths_init.general,
      `output/${sign}_general.mp3`,
      threshold
    ),
    increaseAudioVolume(
      audio_paths_init.career,
      `output/${sign}_career.mp3`,
      threshold
    ),
    increaseAudioVolume(
      audio_paths_init.love,
      `output/${sign}_love.mp3`,
      threshold
    ),
    increaseAudioVolume(
      audio_paths_init.wellness,
      `output/${sign}_wellness.mp3`,
      threshold
    ),
  ];
  await Promise.all(increase_volume_requests);

  await sleep(1500); // temporary fix

  // delete initial audios
  await fs.unlink(audio_paths_init.general);
  await fs.unlink(audio_paths_init.career);
  await fs.unlink(audio_paths_init.love);
  await fs.unlink(audio_paths_init.wellness);

  console.log(`TTS generated for ${sign}..`);
})();
