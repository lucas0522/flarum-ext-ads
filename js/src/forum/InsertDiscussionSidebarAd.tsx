import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import type * as Mithril from 'mithril';
import RefreshAds from './RefreshAds';
import type ItemList from 'flarum/common/utils/ItemList';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertDiscussionSidebarAd() {
  const AdCode = app.forum.attribute('hertz-ads.ad-code.discussion_sidebar') as string;
  const Script = app.forum.attribute('hertz-ads.ad-code.discussion_sidebar.js') as string;

  if (!AdCode) return;

  const Html = m.trust(AdCode) as ReturnType<Mithril.Static['trust']>;

  // 设置 CSS 变量
  const root = document.querySelector(':root') as HTMLHtmlElement;
  root.style.setProperty('--hertz-ads--discussion-sidebar-position', '36px');

  // 辅助函数：判断是否为桌面端 (大于 768px)
  const isDesktop = () => window.innerWidth >= 768;

  extend(DiscussionPage.prototype, 'sidebarItems', function (this: IndexPage, items: ItemList<Mithril.Children>) {
    if (areAdsBypassed()) return;

    // 性能优化：用 isDesktop() 替代 getComputedStyle
    if (isDesktop()) {
      // 修改点：davwheat-ad -> hertz-ad
      items.add('hertz-ads', <div class="hertz-ad hertz-ad-discussion-sidebar">{Html}</div>, 1000);
    }
  });

  extend(DiscussionPage.prototype, ['oncreate', 'onupdate'], function (this: IndexPage) {
    if (areAdsBypassed()) return;

    // 修改点：查询选择器也必须改
    if (document.querySelector('.hertz-ad-discussion-sidebar')) {
        RefreshAds();
        safelyEvalAdScript('discussion sidebar', Script);
    }
  });
}