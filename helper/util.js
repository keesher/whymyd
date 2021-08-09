const parseCookies = function (raw) {
  if (!raw) {
    return [];
  }
  const cookies = {};
  for (cookie of raw.split("; ")) {
    const [key, value] = cookie.split("=");
    cookies[key] = value;
  }
  return cookies;
};

module.exports = {
  parseCookies,
};
