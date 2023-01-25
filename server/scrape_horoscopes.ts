import fs from "fs/promises";
import { getHoroscopeTomorrowAllCategories } from "./services/horoscope";

(async () => {
  const horoscope_data = await getHoroscopeTomorrowAllCategories();
  await fs.writeFile("output/horoscope.json", JSON.stringify(horoscope_data));
  console.log("Horoscopes scraped successfully..");
})();
