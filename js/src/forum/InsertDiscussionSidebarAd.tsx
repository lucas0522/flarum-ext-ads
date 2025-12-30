import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import m from 'mithril';
import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertDiscussionSidebarAd() {
  extend(DiscussionPage.prototype, 'sidebarItems', function (items) {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('discussion_sidebar')) return;

    if (areAdsBypassed()) return;

    const AdCode = app.forum.attribute('hertz-ads.ad-code.discussion_sidebar') as string;
    if (!AdCode) return;

    items.add(
      'hertz-ad-discussion-sidebar',
      <div className="hertz-ad hertz-ad-discussion-sidebar" style={{textAlign: 'center', marginBottom: '20px'}}>
        {m.trust(AdCode)}
      </div>,
      -100
    );
  });

  extend(DiscussionPage.prototype, 'oncreate', function () {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('discussion_sidebar')) return;
    
    if (areAdsBypassed()) return;

    const Script = app.forum.attribute('hertz-ads.ad-code.discussion_sidebar.js') as string;
    
    // ✅ 修复：互斥逻辑
    if (Script) {
      safelyEvalAdScript('discussion_sidebar', Script);
    } else {
      RefreshAds();
    }
  });
}