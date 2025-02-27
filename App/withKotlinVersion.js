// withKotlinVersion.js
const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withKotlinVersion(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      // Replace the existing kotlinVersion with '1.9.24'
      config.modResults.contents = config.modResults.contents.replace(
        /ext\.kotlinVersion *= *['"][^'"]+['"]/,
        "ext.kotlinVersion = '1.9.24'"
      );
    }
    return config;
  });
};
