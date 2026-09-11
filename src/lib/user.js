function capitalize(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Builds the display user shown on the profile page from app config.
function getDisplayUser(config) {
  const rawName = config.user.name;
  const name = capitalize(rawName);
  const firstname = capitalize(rawName.split(" ")[0]);

  return {
    name,
    firstname,
    id: config.user.id,
    key: config.user.interests,
  };
}

module.exports = { capitalize, getDisplayUser };
