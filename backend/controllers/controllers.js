const healthCheck = (req, res) => {
  return res.status(200).json({
    status: true,
    message: "backend is up",
  });
};

const generateRoom = (req, res) => {
  const { query } = req;

  if (query?.url) {
    return res.status(200).json({
      status: true,
      url: query.url,
    });
  }

  const length = 6;
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return res.status(200).json({
    status: true,
    url: result,
  });
};

module.exports = { generateRoom, healthCheck };
