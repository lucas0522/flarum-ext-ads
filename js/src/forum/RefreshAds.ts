declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function RefreshAds() {
  // 定义一个递归函数来尝试加载
  const pushAd = (attempts: number) => {
    try {
      // 确保 adsbygoogle 数组存在
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {
      // 只有当前端真的有广告容器但 JS 还没加载完时才重试
      // 最多重试 5 次，每次间隔 1 秒，避免无限死循环
      if (attempts < 5) {
        setTimeout(() => pushAd(attempts + 1), 1000);
      }
    }
  };

  // 启动
  pushAd(0);
}