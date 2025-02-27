// app.config.js
const withKotlinVersion = require('./withKotlinVersion');

export default ({ config }) => {
  // Apply the custom plugin to modify the native Gradle file
  config = withKotlinVersion(config);
  return config;
};
