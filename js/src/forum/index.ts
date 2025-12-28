import app from 'flarum/forum/app';
import type { AdUnitLocations } from 'src/common/AdUnitLocations';
import InsertBetweenPostsAds from './InsertBetweenPostsAds';

import InsertDiscussionPageHeaderAd from './InsertDiscussionPageHeaderAd';
import InsertDiscussionSidebarAd from './InsertDiscussionSidebarAd';
import InsertFooterAd from './InsertFooterAd';
import InsertHeaderAd from './InsertHeaderAd';
import InsertSidebarAd from './InsertSidebarAd';

// 修改点：注册 ID 改为 hertz/ads
app.initializers.add('hertz/ads', () => {
  // 安全修复：如果设置不存在，默认使用空数组 '[]'，防止 JSON.parse 报错导致白屏
  const rawSettings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
  
  let enabledSlots: AdUnitLocations[] = [];
  try {
      enabledSlots = JSON.parse(rawSettings);
  } catch (e) {
      console.error('[hertz/ads] Failed to parse enabled locations settings.', e);
      enabledSlots = [];
  }

  if (enabledSlots.includes('header')) {
    InsertHeaderAd();
  }

  if (enabledSlots.includes('discussion_header')) {
    InsertDiscussionPageHeaderAd();
  }

  if (enabledSlots.includes('footer')) {
    InsertFooterAd();
  }

  if (enabledSlots.includes('between_posts')) {
    InsertBetweenPostsAds();
  }

  if (enabledSlots.includes('sidebar')) {
    InsertSidebarAd();
  }

  if (enabledSlots.includes('discussion_sidebar')) {
    InsertDiscussionSidebarAd();
  }
});