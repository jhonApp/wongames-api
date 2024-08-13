import axios from "axios";
import { JSDOM } from "jsdom";
import { factories } from "@strapi/strapi";

async function getGameInfo(slug) {
  try {
    const gogSlug = slug.replaceAll("-", "_").toLowerCase();

    const body = await axios.get(`https://www.gog.com/game/${gogSlug}`);
    const dom = new JSDOM(body.data);

    const raw_description = dom.window.document.querySelector(".description");

    const description = raw_description.innerHTML;
    const short_description = raw_description.textContent.slice(0, 160);

    const ratingElement = dom.window.document.querySelector(".age-restrictions__icon use");

    return {
      description,
      short_description,
      rating: ratingElement
        ? ratingElement.getAttribute("xlink:href").replace(/_/g, "").replace("#", "")
        : "BR0",
    };
  } catch (error) {
    console.error("Error fetching game info:", error);
    throw error;
  }
}

export default factories.createCoreService("api::game.game", ({ strapi }) => ({
  async populate(params) {
    try {
      const gogApiUrl = `https://catalog.gog.com/v1/catalog?limit=48&order=desc%3Atrending`;

      const { data: { products } } = await axios.get(gogApiUrl);

      await strapi.service("api::developer.developer").create({
          data: {
              name: "CD Project Red",
              slug: "cd-project-red"
          },
      });

      const gameInfo = await getGameInfo(products[2].slug);
      console.log(gameInfo);

      // Return some response if needed
      return { message: "Populate completed" };
    } catch (error) {
      console.error("Error in populate method:", error);
      throw error;
    }
  },
}));
