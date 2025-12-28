import app from 'flarum/forum/app';

import { extend, override } from 'flarum/common/extend';

import IndexPage from 'flarum/forum/components/IndexPage';

import type * as Mithril from 'mithril';
import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertHeaderAd() {
  const AdCode = app.data['hertz-ads.ad-code.header'] as string;
  const Script = app.data['hertz-ads.ad-code.header.js'] as string;

  const Html = m.trust(AdCode) as ReturnType<Mithril.Static['trust']>;

  override(IndexPage.prototype, 'hero', function (originalHero: () => Mithril.Children): Mithril.Children {
    if (areAdsBypassed()) return originalHero();

    return (
      <>
        {originalHero()}
        {/* 修改点：类名改为 hertz-ad */}
        <div align="center" class="hertz-ad hertz-ad-header">
          {Html}
        </div>
      </>
    );
  });

  extend(IndexPage.prototype, ['oncreate', 'onupdate'], function (this: IndexPage, returned: any) {
    if (areAdsBypassed()) return;

    RefreshAds();
    safelyEvalAdScript('header', Script);
  });
}