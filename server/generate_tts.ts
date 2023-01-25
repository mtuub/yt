import fs from "fs/promises";
import convertTTSDescript from "./services/tts";
import { Horoscope } from "./types";
import { increaseAudioVolume, sleep, trimToSentence } from "./utils";
const { exec } = require("child_process");

(async () => {
  const sign = process.argv[2].toLowerCase();
  const character_limit = 980;

  const horoscope: Horoscope[] = JSON.parse(
    await fs.readFile("output/horoscope.json", "utf-8")
  );

  const sign_horoscope = horoscope.find((h) => h.sign.toLowerCase() === sign);
  const no_of_tts_requests = Math.ceil(horoscope.length / character_limit) + 1;

  try {
    await fs.mkdir(`output/${sign}`, { recursive: true });
  } catch (error) {}

  // trim horoscope according to character limit
  let prev_sentence_count = 0;
  const tts_texts = [];
  for (let idx = 0; idx < no_of_tts_requests; idx++) {
    const trimmed_text_data = trimToSentence(
      sign_horoscope.horoscope,
      prev_sentence_count,
      character_limit
    );
    prev_sentence_count = trimmed_text_data.sentence_count;
    tts_texts.push(trimmed_text_data.text);
  }

  // generate tts audios in parallel
  const tts_requests = tts_texts.map((text, idx) => {
    return convertTTSDescript(text, `output/${sign}/${sign}_part_${idx}.mp3`);
  });
  await Promise.all(tts_requests);

  // increase volume of audios
  const cmds = tts_texts.map((_, idx) =>
    increaseAudioVolume(
      `output/${sign}/${sign}_part_${idx}.mp3`,
      `output/${sign}/${sign}_part_${idx}_boosted.mp3`,
      2.5
    )
  );
  await Promise.all(cmds);

  // merge boosted audios
  await fs.writeFile(
    `output/${sign}/list.txt`,
    tts_texts
      .map((_, idx) => `file '${sign}_part_${idx}_boosted.mp3'`)
      .join("\n")
  );

  await sleep(1500); // temporary fix
  await exec(
    `ffmpeg -y -f concat -i output/${sign}/list.txt -c copy output/${sign}.mp3`
  );
  await sleep(1500); // temporary fix

  // delete sign folder
  await fs.rm(`output/${sign}`, { recursive: true, force: true });

  console.log(`Generated audio for ${sign}`);
})();
