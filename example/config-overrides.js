class RemoveCssLinkPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('RemoveCssLinkPlugin', (compilation, callback) => {
      compilation.assets = { 'index.html': compilation.assets['index.html'] };

      const newSource = compilation.assets['index.html']
        .source()
        .replace(/<meta name="viewport".+?rel="stylesheet">/, '');

      compilation.assets['index.html'].source = () => newSource;

      callback();
    });
  }
}

module.exports = function override(config, webpackEnv) {
  const isEnvProduction = webpackEnv === 'production';

  if (!isEnvProduction) return config;

  // No chunks. We need a single JS and CSS bundle
  config.optimization.runtimeChunk = false;
  config.optimization.splitChunks = {
    cacheGroups: {
      default: false,
    },
  };

  // Inline all JS and CSS files into index.html file
  config.plugins[1].tests[0] = /.+[.](js|css)/;

  // Remove meta tag with link to unexisting CSS file
  config.plugins.push(new RemoveCssLinkPlugin());

  return config;
};
