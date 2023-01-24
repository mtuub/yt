import {
  getHoroscopeTomorrowCareer,
  getHoroscopeTomorrowGeneral,
  getHoroscopeTomorrowLove,
  getHoroscopeTomorrowWellness,
} from "./services/horoscope";
import fs from "fs/promises";

(async () => {
  const horoscopes_general = await getHoroscopeTomorrowGeneral();
  const horoscopes_love = await getHoroscopeTomorrowLove();
  const horoscopes_career = await getHoroscopeTomorrowCareer();
  const horoscopes_wellness = await getHoroscopeTomorrowWellness();

  await fs.writeFile(
    "output/horoscopes_general.json",
    JSON.stringify(horoscopes_general)
  );
  await fs.writeFile(
    "output/horoscopes_love.json",
    JSON.stringify(horoscopes_love)
  );
  await fs.writeFile(
    "output/horoscopes_career.json",
    JSON.stringify(horoscopes_career)
  );
  await fs.writeFile(
    "output/horoscopes_wellness.json",
    JSON.stringify(horoscopes_wellness)
  );
  console.log("Horoscopes scraped successfully..");
})();
