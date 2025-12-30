const config = require('flarum-webpack-config');
const path = require('path');

// 生成基础配置
const webpackConfig = config({
  useExtensions: ['.ts', '.tsx', '.js', '.jsx']
});

// 1. 【保持原样】暴力指定入口，确保能找到文件
webpackConfig.entry = {
  admin: path.resolve(__dirname, './src/admin/index.ts'),
  forum: path.resolve(__dirname, './src/forum/index.ts')
};

// 2. 【核心修复】配置 Externals (外部依赖)
// 告诉 Webpack：当代码里 import 'mithril' 时，不要把包打进去，
// 而是去浏览器全局变量里找 'm'。这能解决 module.exports 报错。
const originalExternals = webpackConfig.externals || [];
webpackConfig.externals = [
  // 保留 Flarum 原有的外部依赖配置
  ...(Array.isArray(originalExternals) ? originalExternals : [originalExternals]),
  {
    'mithril': 'm' // 映射规则：import ... from 'mithril' -> window.m
  }
];

module.exports = webpackConfig;