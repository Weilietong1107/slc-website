# 申演文化 演出创意工作室网站

这是一个单页面响应式网站，采用艺术家工作室风格设计，参考Robert Wilson官网的美学理念，呈现画廊式的展示效果。

## 项目特点

- **单页面设计**：所有内容集中在一个页面，通过平滑滚动导航
- **响应式布局**：适配桌面、平板和移动设备
- **黑色渐变背景**：营造舞台演出的质感氛围
- **简约导航**：固定顶部导航栏，左侧LOGO，右侧菜单
- **画廊风格**：作品和效果图以画廊形式展示
- **简单交互**：极简的交互方式，注重内容展示

## 文件结构

```
申演文化_Web/
├── index.html      # 主页面HTML结构
├── styles.css      # 样式文件
├── script.js       # JavaScript交互逻辑
└── README.md       # 项目说明文档
```

## 内容区块

1. **首屏（Hero）**：公司名称和副标题
2. **关于我们**：企业介绍
3. **价值观**：公司核心价值观展示
4. **作品集**：项目作品展示
5. **主创**：核心团队成员介绍
6. **效果图画廊**：视觉效果图展示
7. **联系方式**：联系信息

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件即可查看网站
2. 或者使用本地服务器运行（推荐）：
   ```bash
   # 使用Python
   python -m http.server 8000
   
   # 使用Node.js
   npx serve
   ```

## 自定义内容

### 替换占位符内容

- **作品集**：在 `index.html` 中找到 `.portfolio-item` 部分，替换项目名称和描述
- **主创信息**：在 `.team-member` 部分更新团队成员信息
- **联系方式**：在 `#contact` 部分更新实际联系信息
- **公司LOGO**：可以在 `.logo` 部分添加图片或修改文字

### 添加实际图片

将图片文件放在项目目录中，然后在HTML中替换 `.placeholder-image` 为实际的 `<img>` 标签：

```html
<div class="portfolio-image">
    <img src="path/to/your/image.jpg" alt="作品描述">
</div>
```

### 修改颜色和样式

在 `styles.css` 文件的 `:root` 变量中修改颜色方案：

```css
:root {
    --primary-color: #ffffff;
    --secondary-color: #cccccc;
    --accent-color: #ff6b6b;
    --bg-dark: #0a0a0a;
    --bg-darker: #000000;
}
```

## 浏览器兼容性

- Chrome（最新版本）
- Firefox（最新版本）
- Safari（最新版本）
- Edge（最新版本）

## 技术栈

- HTML5
- CSS3（使用CSS Grid和Flexbox）
- Vanilla JavaScript（无依赖）

## 注意事项

- 当前使用的是占位符内容，需要替换为实际内容
- 图片需要自行添加，建议使用高质量图片以获得最佳展示效果
- 可以根据实际需求调整字体、间距和布局

