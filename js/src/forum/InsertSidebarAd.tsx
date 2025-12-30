import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import m from 'mithril';
import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertSidebarAd() {
  extend(IndexPage.prototype, 'sidebarItems', function (items) {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('sidebar')) return;

    if (areAdsBypassed()) return;

    const AdCode = app.forum.attribute('hertz-ads.ad-code.sidebar') as string;
    if (!AdCode) return;

    items.add(
      'hertz-ad-sidebar',
      <div className="hertz-ad hertz-ad-sidebar" style={{textAlign: 'center', marginBottom: '20px'}}>
        {m.trust(AdCode)}
      </div>,
      -100
    );
  });
  
  extend(IndexPage.prototype, 'oncreate', function () {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('sidebar')) return;
    
    if (areAdsBypassed()) return;

    const Script = app.forum.attribute('hertz-ads.ad-code.sidebar.js') as string;
    
    // ✅ 修复：互斥逻辑
    if (Script) {
      safelyEvalAdScript('sidebar', Script);
    } else {
      RefreshAds();
    }
  });
}