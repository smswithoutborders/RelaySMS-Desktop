import { extractRpcErrorMessage, capitalizeFirstLetter } from "../lib/utils";

export const fetchPlatforms = async ({ name, shortcode } = {}) => {
  try {
    const response = await fetch("/platforms_resources/platforms.json");
    const platformsData = await response.json();

    const filteredPlatforms = platformsData.filter((platform) => {
      const matchesName = name
        ? platform.name.toLowerCase().includes(name.toLowerCase())
        : true;
      const matchesShortcode = shortcode
        ? platform.shortcode && platform.shortcode.includes(shortcode)
        : true;

      return matchesName || matchesShortcode;
    });

    const updatedPlatforms = filteredPlatforms.map((platform) => ({
      ...platform,
      name: capitalizeFirstLetter(platform.name),
      avatar: `./platforms_resources/icons/${platform.name}.png`,
    }));

    return updatedPlatforms;
  } catch (error) {
    console.error("Error loading platforms.json:", error);
    throw error;
  }
};

export const createEntity = async () => {
  const request = {
    country_code: "US",
    phone_number: "+11111234567890",
    password: "password123",
    client_publish_pub_key: "pubKey1",
    client_device_id_pub_key: "pubKey2",
    ownership_proof_response: "ownershipProof",
  };

  try {
    const response = await window.api.invoke("CreateEntity", request);
    console.log("CreateEntity Response:", response);
  } catch (error) {
    console.error("Error message:", extractRpcErrorMessage(error.message));
    console.error("Error:", error);
  }
};
