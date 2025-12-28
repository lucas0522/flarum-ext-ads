import app from 'flarum/admin/app';

import SettingsPage from './components/SettingsPage';

import type { CustomExtensionPage } from 'flarum/admin/utils/ExtensionData';

app.initializers.add('hertz/ads', () => {
  app.extensionData
    .for('hertz-dev-ads')
    .registerPage(SettingsPage as unknown as CustomExtensionPage)
    .registerPermission(
      {
        icon: 'fas fa-shield-alt',
        permission: 'hertz-ads.bypass-ads',
        // 修改点：davwheat -> hertz
        label: app.translator.trans('hertz.ads.admin.permissions.bypassAds'),
        allowGuest: true,
      },
      'view'
    );
});