import app from 'flarum/admin/app';

import SettingsPage from './components/SettingsPage';

import type { CustomExtensionPage } from 'flarum/admin/utils/ExtensionData';

// ✅ 修改点：统一 ID 为 'hertz-dev-ads'，与前台保持一致
app.initializers.add('hertz-dev-ads', () => {
  app.extensionData
    .for('hertz-dev-ads') // ✅ 这里的 ID 必须匹配 composer.json (自动生成的)，你写对了
    .registerPage(SettingsPage as unknown as CustomExtensionPage)
    .registerPermission(
      {
        icon: 'fas fa-shield-alt',
        permission: 'hertz-ads.bypass-ads', // ✅ 对应 PHP 里的权限检查，写对了
        // 修改点：davwheat -> hertz
        label: app.translator.trans('hertz.ads.admin.permissions.bypassAds'), // ⚠️ 请确保 locale/en.yml 里有这个翻译键值
        allowGuest: true,
      },
      'view'
    );
});