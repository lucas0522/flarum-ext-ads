import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import Page from 'flarum/common/components/Page';
import Component from 'flarum/common/Component';
import m from 'mithril';
import RefreshAds from './RefreshAds';
import safelyEvalAdScript from './safelyEvalAdScript';

class FooterAdComponent extends Component {
  view() {
    const AdCode = app.forum.attribute('hertz-ads.ad-code.footer') as string;
    
    return m('div', {
      className: 'hertz-ad hertz-ad-footer',
      style: {
        textAlign: 'center',
        padding: '20px 0',
        width: '100%',
        clear: 'both',
        // ✅ 正式样式：透明背景，无边框
        background: 'transparent', 
        minHeight: '90px', // 预留高度，避免布局跳动
        zIndex: 9999, 
        position: 'relative', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }
    }, [
      m.trust(AdCode)
    ]);
  }

  oncreate() {
    const Script = app.forum.attribute('hertz-ads.ad-code.footer.js') as string;
    
    if (Script) {
      safelyEvalAdScript('footer', Script);
    } else {
      RefreshAds();
    }
  }
}

function forceMountFooter() {
    const settings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
    if (!settings.includes('footer')) return;

    const AdCode = app.forum.attribute('hertz-ads.ad-code.footer') as string;
    if (!AdCode) return;

    // 优先插入到内容区底部，其次是 Body
    const target = document.querySelector('.App-content') || document.body;
    if (!target) return;

    let mountPoint = document.getElementById('hertz-global-footer-mount');
    
    if (!mountPoint) {
        mountPoint = document.createElement('div');
        mountPoint.id = 'hertz-global-footer-mount';
        mountPoint.style.width = '100%';
        target.appendChild(mountPoint);
        m.mount(mountPoint, FooterAdComponent);
    } else {
        if (target.lastElementChild !== mountPoint) {
            target.appendChild(mountPoint);
        }
    }
}

export default function InsertFooterAd() {
  // 监听 Page 页面组件，确保在页面切换时也能触发
  extend(Page.prototype, 'oncreate', function () {
    setTimeout(forceMountFooter, 500); 
  });

  extend(Page.prototype, 'onupdate', function () {
    setTimeout(forceMountFooter, 500);
  });
}