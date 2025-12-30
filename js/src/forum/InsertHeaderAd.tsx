import app from 'flarum/forum/app';
import { override, extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import m from 'mithril';
import type * as Mithril from 'mithril';
import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertHeaderAd() {
  override(IndexPage.prototype, 'hero', function (originalHero: () => Mithril.Children): Mithril.Children {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('header')) return originalHero();

    if (areAdsBypassed()) return originalHero();

    const AdCode = app.forum.attribute('hertz-ads.ad-code.header') as string;
    if (!AdCode) return originalHero();

    return [
      originalHero(),
      <div className="hertz-ad hertz-ad-header" style={{textAlign: 'center', marginTop: '15px'}}>
        {m.trust(AdCode)}
      </div>
    ];
  });

  // ❌ 修正：去掉了 'onupdate'，只保留 'oncreate'
  // 这样广告只会在页面加载时请求一次，不会反复请求导致报错
  extend(IndexPage.prototype, 'oncreate', function (this: IndexPage) {
     const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
     if (!settings.includes('header')) return;
     if (areAdsBypassed()) return;

     const Script = app.forum.attribute('hertz-ads.ad-code.header.js') as string;
     
     if (Script) {
       safelyEvalAdScript('header', Script);
     } else {
       RefreshAds();
     }
  });
}