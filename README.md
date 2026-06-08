# 快点开源软件趋势

GitHub 开源项目趋势分析平台 — 发现最热门的仓库，追踪技术趋势，查看热门收藏排名。

## 功能

- **热门仓库** — 按时间周期（过去一天/一周/一个月/三个月）和编程语言筛选，查看 GitHub 趋势项目排名
- **热门收藏** — 浏览 OSSInsight 精选的技术领域收藏集，查看各领域 Top 5 仓库及排名变化
- **响应式布局** — 适配桌面到移动端各种屏幕尺寸
- **自适应字体** — 使用 `clamp()` 流体排版，确保各设备阅读体验

## 技术栈

- [React 19](https://react.dev/)
- [Vite 8](https://vitejs.dev/)
- [Font Awesome 6](https://fontawesome.com/) (Free)
- [OSSInsight API](https://ossinsight.io/)

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 数据来源

数据由 [OSSInsight](https://ossinsight.io/) 提供，通过 Vite 代理转发至 `/api` 路径。

## License

© 2026 [HuanGeTech](https://github.com/muzihuaner/github-trending-website)
