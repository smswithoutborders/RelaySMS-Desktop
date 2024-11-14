const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const fetchPlatforms = async ({ name, shortcode } = {}) => {
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

export default fetchPlatforms;
