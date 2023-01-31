import fs from "fs/promises";
import { getHoroscopeTomorrowAllCategories } from "./services/horoscope";

(async () => {
  const horoscope_data = await getHoroscopeTomorrowAllCategories();
  await fs.writeFile(
    "output/horoscope.json",
    JSON.stringify(horoscope_data.slice(0, 1)) // TODO: remove slice + refresh pictory token
  );
  console.log("Horoscopes scraped successfully..");
})();
