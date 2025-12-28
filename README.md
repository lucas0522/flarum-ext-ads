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
composer require hertz/flarum-ext-ads

♻️ Updating
composer update hertz/flarum-ext-ads
php flarum cache:clear

⚙️ Configuration
Go to your Flarum Administration Dashboard.

Enable Hertz Ads.

Go to the settings page, paste your HTML/JS ad codes (e.g., Google AdSense), and enable the desired locations.

Note: If you are migrating from davwheat/ads, you must uninstall the old extension first. Settings will not be automatically migrated as this extension uses a new database namespace to ensure stability.

📄 License
Released under the MIT License.

Credits: Based on the original work by David Wheatley.