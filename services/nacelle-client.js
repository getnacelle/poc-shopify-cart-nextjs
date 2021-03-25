import NacelleClient from "@nacelle/client-js-sdk";

const settings = {
  id: process.env.NACELLE_SPACE_ID,
  token: process.env.NACELLE_GRAPHQL_TOKEN,
  nacelleEndpoint: "https://hailfrequency.com/v3/graphql",
  useStatic: false,
};

const pimSettings = { ...settings, locale: process.env.PIM_LOCALE };
const cmsSettings = { ...settings, locale: process.env.CMS_LOCALE };

const client = new NacelleClient(cmsSettings);
const clientPIM = new NacelleClient(pimSettings);

for (const method in [
  "product",
  "products",
  "collection",
  "collectionPage",
  "allProducts",
  "allCollections",
]) {
  client.data[method] = clientPIM.data[method];
}

export default client;
