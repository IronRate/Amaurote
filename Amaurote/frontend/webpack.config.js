﻿const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const path = require("path");

const sourcePath = path.resolve(__dirname, "app");
const distPath = path.resolve(__dirname, "build");
const externalScriptsPath = path.resolve(__dirname, "scripts");
const node_modules = path.resolve(__dirname, "node_modules");

const Agent = require("agentkeepalive");
const proxyMiddleware = require("http-proxy-middleware");

let middleware = [
  proxyMiddleware("/api", {
    changeOrigin: true,
    target: "http://localhost:5000/api/",
    agent: new Agent({
      maxSockets: 100,
      keepAlive: true,
      maxFreeSockets: 10,
      keepAliveMsecs: 100000,
      timeout: 6000000,
      keepAliveTimeout: 90000 // free socket keepalive for 90 seconds
    }),
    onProxyRes: proxyRes => {
      var key = "www-authenticate";
      proxyRes.headers[key] =
        proxyRes.headers[key] && proxyRes.headers[key].split(",");
    }
  })
  // ... removed for brevity
];

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  const plugins = [
    new HtmlWebPackPlugin({
      template: sourcePath + "/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash:4].css",
      chunkFilename: "[id].[contenthash:4].css"
    }),
    new ForkTsCheckerWebpackPlugin({
      tslint: false,
      checkSyntacticErrors: false
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "window.$": "jquery"
    })
  ];

  if (isProd) {
    plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /\/environments\/environment\.ts/,
        `${sourcePath}/environments/environment.prod.ts`
      ),
      new UglifyJsPlugin({
        sourceMap: true
      })
    );
  } else {
    plugins.push(
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    );
  }

  const config = {
    entry: {
      app: sourcePath + "/src/amaurote.ts"
      //style: sourcePath + "/styles.scss",
      //cadesplugin: externalScriptsPath + "/webcrypto/cadesplugin.js",
      //vendor: ["signalr", "angular"]
    },
    output: {
      path: distPath,
      filename: "[name].bundle.[hash:4].js"
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: [
            path.resolve(__dirname, "./node_modules"),
            path.resolve(__dirname, "./app/index.html")
          ],
          use: [
            {
              loader: "html-loader",
              options: {
                minimize: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "resolve-url-loader"]
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "resolve-url-loader",
            "sass-loader"
          ]
        },
        {
          test: /\.less$/,
          loader: "less-loader"
        },
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                configFile: sourcePath + "/tsconfig.app.json",
                transpileOnly: true
              }
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          loader: "file-loader",
          options: {
            name: "images/[name].[ext]"
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]"
          }
        }
      ]
    },
    resolve: {
      extensions: [".js", ".ts"],
      modules: [path.resolve(__dirname, "node_modules"), sourcePath]
    },
    plugins,
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all"
          }
        }
      }
    },
    // devtool: 'eval-source-map',
    devServer: {
      contentBase: distPath,
      hot: true,
      proxy: {
        "/api/**": {
          target: "http://localhost:60643/api/",
          pathRewrite: {
            "^/api": ""
          },
          logLevel: "debug",
          changeOrigin: true,
          agent: new Agent({
            maxSockets: 100,
            keepAlive: true,
            maxFreeSockets: 10,
            keepAliveMsecs: 1000,
            timeout: 60000,
            keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
          }),
          onProxyRes: proxyRes => {
            var key = "www-authenticate";
            proxyRes.headers[key] =
              proxyRes.headers[key] && proxyRes.headers[key].split(",");
          }
        },
        "/content/**":{
          target:"http://localhost:60643/content/",
          pathRewrite:{
            "^/content":""
          },
          logLevel: "debug",
          changeOrigin: true,
          agent: new Agent({
            maxSockets: 100,
            keepAlive: true,
            maxFreeSockets: 10,
            keepAliveMsecs: 1000,
            timeout: 60000,
            keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
          }),
          onProxyRes: proxyRes => {
            var key = "www-authenticate";
            proxyRes.headers[key] =
              proxyRes.headers[key] && proxyRes.headers[key].split(",");
          }
        },
        "/signalr/**": {
          target: "http://localhost:60643/signalr/",
          pathRewrite: {
            "^/signalr": ""
          },
          logLevel: "debug",
          changeOrigin: true,
          agent: new Agent({
            maxSockets: 100,
            keepAlive: true,
            maxFreeSockets: 10,
            keepAliveMsecs: 1000,
            timeout: 60000,
            keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
          }),
          onProxyRes: proxyRes => {
            var key = "www-authenticate";
            proxyRes.headers[key] =
              proxyRes.headers[key] && proxyRes.headers[key].split(",");
          }
        }
      }
    }
  };

  if (!isProd) {
    config.devtool = "source-map";
  }

  return config;
};
