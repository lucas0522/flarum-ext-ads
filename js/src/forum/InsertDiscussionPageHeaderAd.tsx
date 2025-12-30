import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import DiscussionPage from 'flarum/forum/components/DiscussionPage';
import m from 'mithril';
import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertDiscussionPageHeaderAd() {
  extend(DiscussionPage.prototype, 'view', function (vnode) {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('discussion_header')) return;

    if (areAdsBypassed()) return;

    const AdCode = app.forum.attribute('hertz-ads.ad-code.discussion_header') as string;
    if (!AdCode) return;

    const rootChildren = Array.isArray(vnode.children) ? vnode.children : [vnode.children];

    // 寻找内部容器，精准插在标题栏下方
    const discussionContent = rootChildren.find((child: any) => 
      child && child.attrs && child.attrs.className && child.attrs.className.includes('DiscussionPage-discussion')
    );

    if (discussionContent && Array.isArray(discussionContent.children)) {
      const ad = (
        <div className="hertz-ad hertz-ad-discussion-header" style={{textAlign: 'center', marginBottom: '20px'}}>
          {m.trust(AdCode)}
        </div>
      );
      discussionContent.children.splice(1, 0, ad);
    }
  });

  extend(DiscussionPage.prototype, 'oncreate', function () {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('discussion_header')) return;
    if (areAdsBypassed()) return;

    const Script = app.forum.attribute('hertz-ads.ad-code.discussion_header.js') as string;
    
    // ✅ 修复：互斥逻辑
    if (Script) {
      safelyEvalAdScript('discussion_header', Script);
    } else {
      RefreshAds();
    }
  });
}