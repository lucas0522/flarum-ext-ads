const config = require('flarum-webpack-config');
const path = require('path');

// 1. 先生成基础配置（让它报它的错，我们不理它）
const webpackConfig = config({
  useExtensions: ['.ts', '.tsx', '.js', '.jsx']
});

// 2. 【核心修复】暴力覆盖入口配置
// 不管上面检测到了什么，这里强行指定我们要编译的文件
webpackConfig.entry = {
  admin: path.resolve(__dirname, './src/admin/index.ts'),
  forum: path.resolve(__dirname, './src/forum/index.ts')
};

// 3. 导出修改后的配置
module.exports = webpackConfig;