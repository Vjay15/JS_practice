const path = require("path");
module.exports = {
    mode:"development",
    entry:{ 
      main: "./src/index.js",
      vendor: "./src/vendor.js"
    },
    output:{
        filename:"main-[contenthash].js",
        path:path.resolve(__dirname,"dist")
    },
    module: {
        rules: [
          {
            test:/\.html$/,
            use:["html-loader"]
          },
          {
            test:/\.(svg|png|jpg|gif)$/,
            use:{
              loader: "file-loader",
              options: {
              name:"[name].[hash].[ext]",
              outputPath:"imgs"
              }
            }
          }
        ],
      }
}