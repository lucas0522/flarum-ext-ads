import app from 'flarum/forum/app';
import type { AdUnitLocations } from 'src/common/AdUnitLocations';
import InsertBetweenPostsAds from './InsertBetweenPostsAds';

import InsertDiscussionPageHeaderAd from './InsertDiscussionPageHeaderAd';
import InsertDiscussionSidebarAd from './InsertDiscussionSidebarAd';
import InsertFooterAd from './InsertFooterAd';
import InsertHeaderAd from './InsertHeaderAd';
import InsertSidebarAd from './InsertSidebarAd';

// ✅ 修改 1: 统一 ID 为 'hertz-dev-ads' (与 composer.json 和 admin 端保持一致)
app.initializers.add('hertz-dev-ads', () => {
  
  // ✅ 修改 2: 增加环境检查 (这是修复报错的关键！)
  // 如果当前环境没有 app.forum (比如在后台 Admin)，直接退出，防止崩溃。
  if (!app.forum) {
    return;
  }

  // 安全修复：如果设置不存在，默认使用空数组 '[]'
  const rawSettings = app.forum.attribute<string>('hertz-ads.enabled-ad-locations') || '[]';
  
  let enabledSlots: AdUnitLocations[] = [];
  try {
      enabledSlots = JSON.parse(rawSettings);
  } catch (e) {
      console.error('[hertz-dev-ads] Failed to parse enabled locations settings.', e);
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