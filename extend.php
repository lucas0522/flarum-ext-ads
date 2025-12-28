<?php

/*
 * This file is part of hertz/flarum-ext-ads.
 *
 * Copyright (c) 2025 Hertz.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Hertz\Ads;

use Flarum\Extend;
use Flarum\Api\Serializer\ForumSerializer;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less')
        ->content(ForumDocumentContent::class),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/less/admin.less'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(ForumAttributes::class),

    // --- ⬇️ 修改重点：使用 Flarum 原生设置扩展器 (无需 ExtensionSettings.php) ---
    (new Extend\Settings())
        // 纯 HTML 广告代码
        ->serializeToForum('hertz-ads.ad-code.between_posts', 'hertz-ads.ad-code.between_posts')
        ->serializeToForum('hertz-ads.ad-code.discussion_header', 'hertz-ads.ad-code.discussion_header')
        ->serializeToForum('hertz-ads.ad-code.discussion_sidebar', 'hertz-ads.ad-code.discussion_sidebar')
        ->serializeToForum('hertz-ads.ad-code.footer', 'hertz-ads.ad-code.footer')
        ->serializeToForum('hertz-ads.ad-code.header', 'hertz-ads.ad-code.header')
        ->serializeToForum('hertz-ads.ad-code.sidebar', 'hertz-ads.ad-code.sidebar')

        // 配套的 JS 代码
        ->serializeToForum('hertz-ads.ad-code.between_posts.js', 'hertz-ads.ad-code.between_posts.js')
        ->serializeToForum('hertz-ads.ad-code.discussion_header.js', 'hertz-ads.ad-code.discussion_header.js')
        ->serializeToForum('hertz-ads.ad-code.discussion_sidebar.js', 'hertz-ads.ad-code.discussion_sidebar.js')
        ->serializeToForum('hertz-ads.ad-code.footer.js', 'hertz-ads.ad-code.footer.js')
        ->serializeToForum('hertz-ads.ad-code.header.js', 'hertz-ads.ad-code.header.js')
        ->serializeToForum('hertz-ads.ad-code.sidebar.js', 'hertz-ads.ad-code.sidebar.js')

        // 设置默认值
        ->serializeToForum('hertz-ads.between-n-posts', 'hertz-ads.between-n-posts', 15) // 第三个参数是默认值
        ->serializeToForum('hertz-ads.enable-ad-after-placeholder', 'hertz-ads.enable-ad-after-placeholder', 0)
        ->serializeToForum('hertz-ads.enabled-ad-locations', 'hertz-ads.enabled-ad-locations', '[]'),
    // --- ⬆️ 修改结束 ---
];