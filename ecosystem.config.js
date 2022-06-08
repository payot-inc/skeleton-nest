// eslint-disable-next-line @typescript-eslint/no-var-requires
const packagejson = require('./package.json');

module.exports = {
  apps: [
    {
      name: packagejson.name,
      script: './dist/main.js',
      max_memory_restart: '300M',
    },
  ],
};
