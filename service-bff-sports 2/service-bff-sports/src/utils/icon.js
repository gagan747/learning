const getContestantIcons = (contestants = []) => contestants.reduce(
  (acc, { name, image = [] }) => {
    const { url } = image.find((i) => i.size === 'svg') || {};

    if (url) {
      acc[name] = url;
    }

    return acc;
  },
  {},
);

const generateSportIcon = ({ name = '', imageURL = '', keepOriginalColor = false } = {}) => ({
  appIconIdentifier: name.toLowerCase().replace(/\s+/g, '_'),
  imageURL,
  keepOriginalColor,
});

module.exports = {
  generateSportIcon,
  getContestantIcons,
};
