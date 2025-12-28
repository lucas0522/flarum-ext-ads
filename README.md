# Hertz Ads for Flarum

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Flarum](https://img.shields.io/badge/Flarum-1.8%2B-e74c3c.svg)

[English](#english) | [简体中文](#简体中文)

---

<a name="english"></a>
## 🇬🇧 English

**Hertz Ads** is a modernized, high-performance advertisement management extension for Flarum.

It is an optimized fork of the original `davwheat/ads`, designed to fix performance bottlenecks (layout thrashing) and stability issues found in the original version.

### ✨ Key Improvements
Compared to the original version, **Hertz Ads** provides the following optimizations:

1.  **🚀 Performance Optimization:**
    * Rewrote the sidebar ad rendering logic. Replaced the heavy `getComputedStyle` calls (which caused layout thrashing and scroll lag) with lightweight `window.innerWidth` checks.
2.  **🛡️ Stability Fixes:**
    * Fixed a critical "White Screen" crash caused by empty settings in the database. Added robust fallback mechanisms for JSON parsing.
3.  **📱 Modernization:**
    * Refactored backend settings using Flarum 1.8+ native `Extend\Settings` API.
    * Fully rebranded namespace to prevent conflicts.

### 📍 Supported Locations
* **Header:** Above the content area.
* **Footer:** Fixed at the bottom of the page.
* **Sidebar:** Left sidebar (Desktop only).
* **Between Posts:** Insert ads after every X posts in a discussion.
* **Discussion Header:** Above the post stream in a discussion.
* **Discussion Sidebar:** In the discussion sidebar (Desktop only).

### 📥 Installation

Install via Composer:

```bash
composer require lucas0522/flarum-ext-ads
```
♻️ Updating
```Bash

composer update lucas0522/flarum-ext-ads
php flarum cache:clear
```
⚙️ Configuration
Go to your Flarum Administration Dashboard.

Enable Hertz Ads.

Go to the settings page, paste your HTML/JS ad codes (e.g., Google AdSense), and enable the desired locations.

Note: If you are migrating from davwheat/ads, you must uninstall the old extension first. Settings will not be automatically migrated as this extension uses a new database namespace to ensure stability.

📄 License
Released under the MIT License.

Credits: Based on the original work by David Wheatley.

<a name="简体中文"></a>

## 🇨🇳 简体中文

**Hertz Ads** 是一款专为 Flarum 打造的高性能广告管理扩展。

本项目是原 davwheat/ads 插件的优化分支（Fork）。我们修复了原版存在的严重性能瓶颈（页面滚动卡顿）和白屏崩溃问题，使其更适合生产环境使用。

✨ 核心改进
相比原版，Hertz Ads 做了以下关键优化：

🚀 性能飞跃：

重写了侧边栏广告的渲染逻辑。移除了高频触发的 getComputedStyle（会导致浏览器强制重排/回流，引起滚动卡顿），改用高性能的 window.innerWidth 检测，丝般顺滑。

🛡️ 拒绝白屏：

修复了数据库设置为空时，前端 JSON 解析失败导致整个论坛 白屏崩溃 的致命 Bug。增加了完善的容错处理。

📱 现代化重构：

后端完全适配 Flarum 1.8+ 标准，使用原生的 Extend\Settings API。

全新的命名空间和 CSS 类名，避免与旧插件产生冲突。

📍 支持的广告位置
页头 (Header): 位于导航栏下方，内容上方。

页脚 (Footer): 固定在页面最底部。

侧边栏 (Sidebar): 首页左侧导航栏下方 (仅桌面端)。

楼层间 (Between Posts): 在帖子流中，每隔 X 层插入一个广告。

帖子页头部 (Discussion Header): 帖子内容列表的顶部。

帖子页侧边栏 (Discussion Sidebar): 帖子页面的侧边栏 (仅桌面端)。

📥 安装
请在 Flarum 根目录通过 Composer 安装：

```Bash

composer require lucas0522/flarum-ext-ads
```
♻️ 更新
```Bash

composer update lucas0522/flarum-ext-ads
php flarum cache:clear
```
⚙️ 配置方法
进入 Flarum 后台管理页面。

启用 Hertz Ads 扩展。

点击设置，填入你的广告代码（支持 HTML 或 JS，例如 Google AdSense），并开启你想要显示的位置开关。

注意： 如果你之前使用了 davwheat/ads，请务必先卸载旧插件。由于我们采用了全新的数据库命名空间以确保存储安全，旧插件的设置不会自动迁移，请重新填入广告代码。

📄 开源协议
基于 MIT License 发行。

致谢： 本项目基于 David Wheatley 的源代码进行优化和重构。