const webpack = require('webpack');

module.exports = {
  devServer: {
    port: 3000,
  },
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_TIPS__: false
      })
    ]
  }
};
