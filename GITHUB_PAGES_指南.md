# GitHub Pages 部署指南

## 📦 代码已推送成功！

仓库地址：https://github.com/1faye/fortune-app

## 🚀 启用 GitHub Pages（2 分钟完成）

### 步骤 1：打开设置页面
在浏览器中访问：
```
https://github.com/1faye/fortune-app/settings/pages
```

### 步骤 2：配置部署源
在 **"Build and deployment"** 区域：

1. **Source（来源）**：选择 `Deploy from a branch`
2. **Branch（分支）**：
   - 下拉选择：`main` 
   - 文件夹选择：`/docs`
3. 点击 **Save** 按钮

### 步骤 3：等待部署
- GitHub 会自动开始构建（顶部会出现黄色提示条）
- 通常 1-2 分钟内完成
- 刷新页面，会看到绿色的 **"Your site is live at..."** 提示

### 步骤 4：访问网站
部署完成后，访问：
```
https://1faye.github.io/fortune-app/
```

---

## 📱 分享链接

部署完成后，你可以通过以下链接分享：

**完整地址**：
```
https://1faye.github.io/fortune-app/
```

**短链接**（可选）：
使用 bit.ly 或 短链服务缩短 URL

**二维码**：
在线生成工具：https://www.qrcode-monkey.com/
输入上述地址即可生成二维码，方便手机扫码访问

---

## 🔧 如果遇到问题

### 问题 1：404 页面找不到
- **原因**：首次部署需要 3-5 分钟
- **解决**：等待 5 分钟后强制刷新（Cmd+Shift+R）

### 问题 2：样式丢失
- **原因**：路径问题
- **解决**：已自动处理，无需修改

### 问题 3：无法访问设置页面
- **原因**：需要仓库管理员权限
- **解决**：确认已登录 GitHub 账号 `1faye`

---

## 📊 监控部署状态

查看部署历史：
```
https://github.com/1faye/fortune-app/deployments
```

查看最新部署：
```
https://github.com/1faye/fortune-app/actions
```

---

## 🎉 功能特性

部署后的网站包含：
- ✅ 水墨国风 UI（宣纸/墨/朱砂/鎏金）
- ✅ 四大典籍算法增强（滴天髓/子平真诠/三命通会/千里命稿）
- ✅ 七大分组 Tab
- ✅ 响应式设计（支持手机/平板/桌面）
- ✅ 暗色模式 + 打印适配
- ✅ 完全静态，无需服务器

---

## 🔄 后续更新代码

如需更新网站内容：

```bash
cd /Users/macm/Desktop/fortune-server

# 修改 public/ 下的文件后
cp -r public/* docs/
git add docs/
git commit -m "更新内容"
git push origin main

# GitHub Pages 会自动重新部署（1-2 分钟）
```

---

**需要帮助？**
GitHub Pages 文档：https://docs.github.com/pages
