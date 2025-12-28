import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import type * as Mithril from 'mithril';
import RefreshAds from './RefreshAds';
import type ItemList from 'flarum/common/utils/ItemList';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertSidebarAd() {
  const AdCode = app.data['hertz-ads.ad-code.sidebar'] as string;
  const Script = app.data['hertz-ads.ad-code.sidebar.js'] as string;

  if (!AdCode) return;

  const Html = m.trust(AdCode) as ReturnType<Mithril.Static['trust']>;

  // 辅助函数：检查是否是桌面端
  const isDesktop = () => window.innerWidth >= 768;

  extend(IndexPage.prototype, 'sidebarItems', function (this: IndexPage, items: ItemList<Mithril.Children>) {
    if (areAdsBypassed() || app.current.get('routeName') === 'tags') return;

    // Only show sidebar ad on desktop and tablet
    if (isDesktop()) {
      // 修改点：davwheat-ad -> hertz-ad
      items.add('hertz-ads', <div class="hertz-ad hertz-ad-sidebar">{Html}</div>, -1000);
    }
  });

  extend(IndexPage.prototype, ['oncreate', 'onupdate'], function (this: IndexPage) {
    if (areAdsBypassed() || app.current.get('routeName') === 'tags') return;

    // 修改点：查询选择器也必须改
    if (document.querySelector('.hertz-ad-sidebar')) {
        RefreshAds();
        safelyEvalAdScript('sidebar', Script);
    }
  });
}