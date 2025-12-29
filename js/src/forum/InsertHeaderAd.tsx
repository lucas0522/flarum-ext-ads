import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';

// ✅ 修复点：必须引入 m (mithril 核心库)，否则 m.trust 会报错崩溃
import m from 'mithril';
import type * as Mithril from 'mithril';

import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertHeaderAd() {
  const AdCode = app.forum.attribute('hertz-ads.ad-code.header') as string;
  const Script = app.forum.attribute('hertz-ads.ad-code.header.js') as string;

  // 安全检查：如果后台没填代码，直接不渲染
  if (!AdCode) return;

  // 将字符串转换为受信任的 HTML (需要 m)
  const Html = m.trust(AdCode) as ReturnType<Mithril.Static['trust']>;

  override(IndexPage.prototype, 'hero', function (originalHero: () => Mithril.Children): Mithril.Children {
    // 🔍 调试阶段：暂时把权限检查注释掉，确保你能看到红条
    // 调试完成后，记得把下面这行前面的 // 去掉
    // if (areAdsBypassed()) return originalHero();

    return (
      <div className="Hero">
        {originalHero()}
        
        {/* 广告容器：添加了样式以便于调试观察 */}
        <div className="hertz-ad hertz-ad-header" style={{textAlign: 'center', marginTop: '10px'}}>
          {Html}
        </div>
      </div>
    );
  });

  extend(IndexPage.prototype, ['oncreate', 'onupdate'], function (this: IndexPage) {
    // 🔍 调试阶段：暂时注释权限检查
    // if (areAdsBypassed()) return;

    RefreshAds();
    if (Script) {
      safelyEvalAdScript('header', Script);
    }
  });
}