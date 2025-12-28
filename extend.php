<?php

/*
 * This file is part of lucas0522/flarum-ext-ads.
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

    (new Extend\Settings())
        // 纯 HTML 广告代码 (无需默认值，前两个参数即可)
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

        // ✅ 修正点：在默认值前加了 null
        ->serializeToForum('hertz-ads.between-n-posts', 'hertz-ads.between-n-posts', null, 15)
        ->serializeToForum('hertz-ads.enable-ad-after-placeholder', 'hertz-ads.enable-ad-after-placeholder', null, 0)
        ->serializeToForum('hertz-ads.enabled-ad-locations', 'hertz-ads.enabled-ad-locations', null, '[]'),
];