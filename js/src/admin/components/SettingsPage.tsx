import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import Switch from 'flarum/common/components/Switch';
import Select from 'flarum/common/components/Select'; // 引入 Select (如果需要)
import saveSettings from 'flarum/admin/utils/saveSettings';
import extractText from 'flarum/common/utils/extractText';
import { AdUnitLocations, AllAdUnitLocations } from '../../common/AdUnitLocations';
import type Mithril from 'mithril';

const translate = (key: string, data?: Record<string, unknown>): Mithril.Children => app.translator.trans(`hertz.ads.admin.settings.${key}`, data);

export interface ISettingsPageState {
  script_urls: string[];
  enabledLocations: AdUnitLocations[];
  code: Record<AdUnitLocations | `${AdUnitLocations}.js`, string>;
  pubId: string;
  betweenNPosts: number;
  isDirty: boolean;
  loading: boolean;
  enableAdAfterPlaceholder: boolean;
}

export default class SettingsPage extends ExtensionPage {
  state: ISettingsPageState = {
    enabledLocations: [],
    script_urls: [],
    code: {
      header: '', footer: '', sidebar: '', between_posts: '',
      discussion_header: '', discussion_sidebar: '',
      'header.js': '', 'footer.js': '', 'sidebar.js': '',
      'between_posts.js': '', 'discussion_header.js': '', 'discussion_sidebar.js': '',
    },
    enableAdAfterPlaceholder: false,
    betweenNPosts: 0,
    pubId: '',
    isDirty: false,
    loading: false,
  };

  loading!: never;

  oninit(vnode) {
    super.oninit(vnode);
    this.state.enabledLocations = JSON.parse(app.data.settings['hertz-ads.enabled-ad-locations'] || '[]');
    AllAdUnitLocations.forEach((location) => {
      this.state.code[location] = app.data.settings[`hertz-ads.ad-code.${location}`] || '';
      this.state.code[`${location}.js`] = app.data.settings[`hertz-ads.ad-code.${location}.js`] || '';
    });
    this.state.pubId = app.data.settings['hertz-ads.ca-pub-id'] || '';
    this.state.betweenNPosts = parseInt(app.data.settings['hertz-ads.between-n-posts'] || '15');
    this.state.enableAdAfterPlaceholder = app.data.settings['hertz-ads.enable-ad-after-placeholder'] === '1';
    this.state.script_urls = JSON.parse(app.data.settings['hertz-ads.custom-ad-script-urls'] || '[]');
  }

  // ✅ 核心改造：使用 Flarum 标准结构
  content() {
    return (
      <div class="ExtensionPage-settings">
        <div class="container">
          
          {/* 1. 顶部警告区 */}
          <div class="Form-group">
             <div class="Alert Alert--warning">
                <div class="Alert-body">{translate('admin_bypass_warning')}</div>
             </div>
          </div>

          {/* 2. Publisher ID 设置 */}
          <div class="Form-group">
            <label>{translate('pub_id')}</label>
            <input
              class="FormControl"
              placeholder="ca-pub-XXXXXXXXXX"
              type="text"
              value={this.state.pubId}
              disabled={this.state.loading}
              oninput={(e: InputEvent) => {
                this.state.isDirty = true;
                this.state.pubId = (e.currentTarget as HTMLInputElement).value;
              }}
            />
            <div class="helpText">{translate('pub_id_help', { def: 'AdSense Publisher ID' })}</div>
          </div>

          <hr />

          {/* 3. 自定义脚本 URL */}
          <div class="Form-group">
            <label>{translate('script_urls')}</label>
            <div class="helpText">{translate('script_deletion')}</div>
            
            {this.state.script_urls.map((url, i) => (
              <div style="margin-bottom: 10px; display: flex; gap: 10px;">
                <input
                  class="FormControl"
                  placeholder="https://example.com/script.js"
                  type="text"
                  value={url}
                  disabled={this.state.loading}
                  oninput={(e: InputEvent) => {
                    this.state.isDirty = true;
                    this.state.script_urls[i] = (e.currentTarget as HTMLInputElement).value;
                  }}
                />
                 {/* 如果想加个删除按钮可以在这加 */}
              </div>
            ))}
            
            <Button
              class="Button"
              icon="fas fa-plus"
              onclick={() => { this.state.script_urls.push(''); }}
            >
              {translate('add_script')}
            </Button>
          </div>

          <hr />

          {/* 4. 启用位置开关 (更紧凑的网格布局) */}
          <div class="Form-group">
            <label>{translate('enabled_locations')}</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-top: 10px;">
              {AllAdUnitLocations.map((location) => (
                <Switch
                  key={location}
                  state={this.isLocationEnabled(location)}
                  onchange={(val: boolean) => {
                    const s = new Set(this.state.enabledLocations);
                    val ? s.add(location) : s.delete(location);
                    this.state.enabledLocations = Array.from(s);
                    this.state.isDirty = true;
                  }}
                  disabled={this.state.loading}
                >
                  {app.translator.trans(`hertz.ads.lib.locations.${location}`)}
                </Switch>
              ))}
            </div>
          </div>

          <hr />

          {/* 5. 楼层间设置 */}
          <div class="Form-group">
            <label>{translate('between_posts_gap')}</label>
            <div style="display: flex; align-items: center; gap: 20px;">
              <input
                class="FormControl"
                style="width: 100px;"
                type="number"
                min="1"
                max="25"
                value={this.state.betweenNPosts}
                disabled={this.state.loading || !this.isLocationEnabled('between_posts')}
                oninput={(e: InputEvent) => {
                  this.state.isDirty = true;
                  this.state.betweenNPosts = parseInt((e.currentTarget as HTMLInputElement).value);
                }}
              />
              <Switch
                state={this.state.enableAdAfterPlaceholder}
                onchange={(val: boolean) => {
                  this.state.isDirty = true;
                  this.state.enableAdAfterPlaceholder = val;
                }}
                disabled={this.state.loading || !this.isLocationEnabled('between_posts')}
              >
                {translate('allow_after_placeholder')}
              </Switch>
            </div>
          </div>

          <hr />

          {/* 6. 警告提示 */}
          <div class="Form-group">
             <div class="Alert Alert--info">
                <div class="Alert-body">{translate('warning', { script: <code>&lt;script&gt;</code> })}</div>
             </div>
          </div>

          {/* 7. 详细代码配置 (改为 Flarum 风格的卡片) */}
          {AllAdUnitLocations.map((location) => (
             this.isLocationEnabled(location) ? (
              <div class="Form-group" style="background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #e7e7e7; margin-bottom: 20px;">
                <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 16px; font-weight: bold;">
                  {app.translator.trans(`hertz.ads.lib.locations.${location}`)}
                </h3>

                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                  <div style="flex: 1; min-width: 300px;">
                    <label style="display:block; margin-bottom: 5px; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">
                      {translate('code_input')} (HTML)
                    </label>
                    <textarea
                      class="FormControl"
                      style="min-height: 120px; font-family: monospace; font-size: 12px;"
                      value={this.state.code[location]}
                      oninput={(e: InputEvent) => {
                        this.state.isDirty = true;
                        this.state.code[location] = (e.currentTarget as HTMLInputElement).value;
                      }}
                    />
                  </div>
                  
                  <div style="flex: 1; min-width: 300px;">
                    <label style="display:block; margin-bottom: 5px; color: #666; font-size: 12px; text-transform: uppercase; font-weight: bold;">
                      {translate('js_input')} (JS Only)
                    </label>
                    <textarea
                      class="FormControl"
                      style="min-height: 120px; font-family: monospace; font-size: 12px;"
                      value={(this.state.code as any)[`${location}.js`]}
                      oninput={(e: InputEvent) => {
                        this.state.isDirty = true;
                        (this.state.code as any)[`${location}.js`] = (e.currentTarget as HTMLInputElement).value;
                      }}
                    />
                  </div>
                </div>
              </div>
             ) : null
          ))}

          {/* 8. 底部保存按钮 */}
          <div class="Form-group" style="margin-top: 30px; text-align: right;">
            <Button
              type="submit"
              className="Button Button--primary"
              loading={this.state.loading}
              disabled={!this.state.isDirty}
              onclick={this.customSaveSettings.bind(this)}
            >
              {this.getButtonText()}
            </Button>
          </div>

        </div>
      </div>
    );
  }

  // 辅助方法保持不变
  private isLocationEnabled(location: AdUnitLocations): boolean {
    return this.state.enabledLocations.includes(location);
  }

  private getButtonText(): string {
    if (this.state.loading) return extractText(translate('save_btn.saving'));
    if (this.state.isDirty) return extractText(translate('save_btn.dirty'));
    return extractText(translate('save_btn.saved'));
  }

  async customSaveSettings(e: SubmitEvent) {
    e.preventDefault();
    app.alerts.clear();
    this.state.loading = true;

    const doesCodeHaveScriptTag = (Object.keys(this.state.code) as (keyof ISettingsPageState['code'])[]).some((key) => {
      return this.state.code[key].includes('<script');
    });

    if (doesCodeHaveScriptTag && !(window as any).__hertzAds_bypassScriptCheck) {
      app.alerts.show({ type: 'error' }, translate('alert.code_has_script'));
      this.state.loading = false;
      return false;
    }

    await saveSettings({
      'hertz-ads.enabled-ad-locations': JSON.stringify(this.state.enabledLocations),
      'hertz-ads.ca-pub-id': this.state.pubId,
      'hertz-ads.custom-ad-script-urls': JSON.stringify(this.state.script_urls.filter((url) => url.length > 0)),
      'hertz-ads.between-n-posts': this.state.betweenNPosts,
      'hertz-ads.enable-ad-after-placeholder': this.state.enableAdAfterPlaceholder ? 1 : 0,
      ...Object.keys(this.state.code).reduce((prev, curr) => {
        return { ...prev, [`hertz-ads.ad-code.${curr}`]: this.state.code[curr as AdUnitLocations] };
      }, {}),
    });

    this.onSettingsSaved();
    return true;
  }

  onSettingsSaved(): void {
    this.state.loading = false;
    this.state.isDirty = false;
    app.alerts.show({ type: 'success' }, app.translator.trans('core.admin.settings.saved_message'));
  }
}