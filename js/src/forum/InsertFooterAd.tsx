import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import ForumApplication from 'flarum/forum/ForumApplication';
import areAdsBypassed from './areAdsBypassed';
import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';

export default function InsertFooterAd() {
  const AdCode = app.data['hertz-ads.ad-code.footer'] as string;
  const Script = app.data['hertz-ads.ad-code.footer.js'] as string;

  if (!AdCode) return;

  // 使用 Flarum 标准方式：在应用挂载时插入页脚
  extend(ForumApplication.prototype, 'mount', () => {
    if (areAdsBypassed()) return;

    const footer = document.createElement('footer');
    // 修改点：davwheat-ad -> hertz-ad
    footer.className = 'hertz-ad hertz-ad-footer';
    footer.setAttribute('align', 'center');
    footer.innerHTML = AdCode;

    // 找到页面容器并插入
    const appContent = document.querySelector('.App-content');
    if (appContent) {
      appContent.append(footer);
    }
  });

  // 监听路由变化来刷新广告
  app.history.listen(() => {
    if (areAdsBypassed()) return;
    
    // 修改点：查询选择器也必须改
    const footer = document.querySelector('.hertz-ad-footer');
    if (footer) {
      footer.innerHTML = AdCode;
      RefreshAds();
      safelyEvalAdScript('footer', Script);
    }
  });
  
  // 初始化加载
  RefreshAds();
}