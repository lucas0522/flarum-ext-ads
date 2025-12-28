<?php

/*
 * This file is part of hertz-dev/flarum-ext-ads.
 *
 * Copyright (c) 2025 Hertz.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

use Flarum\Database\Migration;

return Migration::addSettings([
    'hertz-ads.enabled-ad-locations' => '[]',
    'hertz-ads.ad-code.header' => '',
    'hertz-ads.ad-code.discussion_sidebar' => '',
    'hertz-ads.ad-code.between_posts' => '',
    'hertz-ads.ad-code.footer' => '',
]);