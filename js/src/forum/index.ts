import { extend } from 'flarum/common/extend';
import app from 'flarum/forum/app';
import InsertBetweenPostsAds from './InsertBetweenPostsAds';
import InsertDiscussionPageHeaderAd from './InsertDiscussionPageHeaderAd';
import InsertDiscussionSidebarAd from './InsertDiscussionSidebarAd';
import InsertFooterAd from './InsertFooterAd';
import InsertHeaderAd from './InsertHeaderAd';
import InsertSidebarAd from './InsertSidebarAd';

console.log('🔥 [Hertz-Debug] index.ts 已加载，等待组件注册...');

app.initializers.add('hertz-dev-ads', () => {
  console.log('🔥 [Hertz-Debug] 初始化器开始运行。此时不检查设置，直接注册所有组件。');
  
  // 直接注册所有广告组件
  // 具体的“开关检查”和“读取代码”逻辑，全部下放到组件内部去执行
  // 这样可以避开初始化时 app.forum 数据未准备好的问题
  InsertHeaderAd();
  InsertDiscussionPageHeaderAd();
  InsertFooterAd();
  InsertBetweenPostsAds();
  InsertSidebarAd();
  InsertDiscussionSidebarAd();

  console.log('✅ [Hertz-Debug] 所有组件注册完毕 (懒加载模式)');
});