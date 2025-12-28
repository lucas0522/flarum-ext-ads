<?php

/**
 * Copyright (c) 2022 David Wheatley
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Hertz\Ads;

use Flarum\Api\Serializer\ForumSerializer;

class ForumAttributes
{
    public function __invoke(ForumSerializer $serializer, $forum, array $attributes)
    {
        $actor = $serializer->getActor();

        $attributes['canBypassAds'] = $actor->can('hertz-ads.bypass-ads');

        return $attributes;
    }
}
