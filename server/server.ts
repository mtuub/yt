import {
  getHoroscopeTomorrowCareer,
  getHoroscopeTomorrowGeneral,
  getHoroscopeTomorrowLove,
  getHoroscopeTomorrowWellness,
} from "./services/horoscope";

(async () => {
  const horoscopes_general = await getHoroscopeTomorrowGeneral();
  const horoscopes_love = await getHoroscopeTomorrowLove();
  const horoscopes_career = await getHoroscopeTomorrowCareer();
  const horoscopes_wellness = await getHoroscopeTomorrowWellness();
})();
