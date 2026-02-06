const required = ["MONGO_URI", "JWT_SECRET"];

function loadEnv() {
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
  }
}

module.exports = { loadEnv };
