import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import PostStream from 'flarum/forum/components/PostStream';
import m from 'mithril';
import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';
import areAdsBypassed from './areAdsBypassed';

export default function InsertBetweenPostsAds() {
  // 1. View 逻辑：负责把广告位“挖”出来 (保持不变)
  extend(PostStream.prototype, 'view', function (vnode) {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('between_posts')) return;
    if (areAdsBypassed()) return;

    const AdCode = app.forum.attribute('hertz-ads.ad-code.between_posts') as string;
    if (!AdCode) return;

    const settingInterval = app.forum.attribute<string | number>('hertz-ads.between-n-posts');
    const interval = parseInt(String(settingInterval || '15'), 10);
    if (interval <= 0) return;

    const posts = vnode.children as m.Vnode[];

    for (let i = posts.length - 1; i > 0; i--) {
      if (i % interval === 0) {
        const ad = (
          <div className="hertz-ad hertz-ad-between-posts" style={{textAlign: 'center'}}>
            {m.trust(AdCode)}
          </div>
        );
        posts.splice(i, 0, ad);
      }
    }
  });

  // 2. 核心逻辑：智能触发函数
  // 这个函数会自动识别“新来的”广告，并忽略“老广告”
  const triggerAds = function(this: PostStream) {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('between_posts')) return;
    if (areAdsBypassed()) return;

    // 获取当前 PostStream 组件下的所有广告容器
    // this.element 是组件对应的真实 DOM 节点
    if (!this.element) return;
    
    const ads = this.element.querySelectorAll('.hertz-ad-between-posts');

    ads.forEach((ad) => {
      // 🔍 检查标记：如果这个广告已经初始化过了，直接跳过！
      if (ad.getAttribute('data-hertz-init') === 'true') {
        return;
      }

      // 🏷️ 打标记：立刻标记为已初始化，防止下次重复执行
      ad.setAttribute('data-hertz-init', 'true');

      // 🚀 执行加载：只针对这个新广告位
      const Script = app.forum.attribute('hertz-ads.ad-code.between_posts.js') as string;
      
      if (Script) {
        safelyEvalAdScript('between_posts', Script);
      } else {
        RefreshAds();
      }
      
      // console.log('✅ [Hertz-Ads] 楼层间广告新插槽已填充');
    });
  };

  // 3. 同时监听 oncreate 和 onupdate
  // oncreate: 负责首屏的前几个广告
  extend(PostStream.prototype, 'oncreate', triggerAds);
  
  // onupdate: 负责无限滚动加载出来的新广告
  extend(PostStream.prototype, 'onupdate', triggerAds);
}