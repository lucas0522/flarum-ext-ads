<?php

/**
 * Copyright (c) 2022 David Wheatley
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Hertz\Ads;

use Flarum\Frontend\Document;
use Flarum\Http\RequestUtil;
use Flarum\Settings\SettingsRepositoryInterface;
use Psr\Http\Message\ServerRequestInterface;

class ForumDocumentContent
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    function __invoke(Document $document, ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);

        if ($actor->can('hertz-ads.bypass-ads')) {
            // Don't add ad code to the frontend page content
            return;
        }

        $caPubId = $this->settings->get('hertz-ads.ca-pub-id', '');

        if ($caPubId !== '') {
            $url = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=$caPubId";

            $document->head[] = "<script async src=\"$url\" crossorigin=\"anonymous\"></script>";
        }

        /**
         * @var array
         */
        $rawScripts = $this->settings->get('hertz-ads.custom-ad-script-urls', '[]');
        $scripts = json_decode($rawScripts, true);

        // 如果解析失败或不是数组，强制为空数组，防止报错
        if (!is_array($scripts)) {
        $scripts = [];
        }

        foreach ($scripts as $script) {
            $document->head[] = "<script async src=\"$script\"></script>";
        }
    }
}
