import app from 'flarum/forum/app';

import { extend, override } from 'flarum/common/extend';

import RefreshAds from './RefreshAds';
import PostStream from 'flarum/forum/components/PostStream';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

import type Mithril from 'mithril';

export default function InsertBetweenPostsAds() {
  const AdCode = app.forum.attribute('hertz-ads.ad-code.between_posts') as string;
  const Script = app.forum.attribute('hertz-ads.ad-code.between_posts.js') as string;

  const Html = m.trust(AdCode) as ReturnType<Mithril.Static['trust']>;

  override(PostStream.prototype, 'view', function (originalView: () => Mithril.Vnode<any, any>): Mithril.Children {
    if (areAdsBypassed()) return originalView();

    const items = originalView().children as Mithril.Children[];

    const newItems = items.reduce((itemList, currentItem, i) => {
      const curr = [...itemList, currentItem];

      // 修改点：Key 改为 hertz-ads
      if (i + 1 < items.length && i % (parseInt(app.forum.attribute('hertz-ads.between-n-posts') as string) || 15) === 0) {
        curr.push(
          <aside key={`hertz-ad-${i}`} class="PostStream-item">
            <div class="hertz-ad hertz-ad-between-posts">{Html}</div>
          </aside>
        );
      }

      return curr;
    }, [] as any[]);

    // 修改点：Key 改为 hertz-ads
    if (app.forum.attribute('hertz-ads.enable-ad-after-placeholder') === '1') {
      newItems.push(
        <aside key={`hertz-ad-after-placeholder`} class="PostStream-item">
          <div class="hertz-ad hertz-ad-between-posts hertz-ad-between-posts--after-placeholder">{Html}</div>
        </aside>
      );
    }

    return <div className="PostStream">{newItems}</div>;
  });

  extend(PostStream.prototype, ['onupdate', 'oncreate'], (originalReturnVal: any) => {
    if (areAdsBypassed()) return;

    RefreshAds();
    safelyEvalAdScript('between posts', Script);
  });
}