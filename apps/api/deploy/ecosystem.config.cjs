const path = require("node:path");

const apiRoot = path.resolve(__dirname, "..");

/** @type {import("pm2").StartOptions} */
module.exports = {
  apps: [
    {
      name: "violette-api",
      cwd: apiRoot,
      script: path.join(apiRoot, "dist/server.js"),
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
      error_file: path.join(apiRoot, "logs/api-error.log"),
      out_file: path.join(apiRoot, "logs/api-out.log"),
      merge_logs: true,
      time: true,
    },
  ],
};
