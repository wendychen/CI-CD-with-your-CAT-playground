# 🎉 歡迎來到 AWS CDK 工作坊！

> 一起來建立一個可愛的貓咪網站，學習 S3 + CloudFront (OAC) + GitHub Actions 的完整部署流程！

## 🌟 這個工作坊會學到什麼？

- **AWS CDK**：用 Python 程式碼定義基礎設施
- **S3 + CloudFront OAC**：建立安全的靜態網站託管
- **GitHub Actions**：自動化 CI/CD 部署流程
- **前端開發**：Vite + 主題切換 + 可愛的貓咪功能

## 🏗️ 架構亮點
- 🔒 **S3 私有儲存桶**：安全第一，禁止公開存取
- ⚡ **CloudFront OAC**：使用 SigV4 安全存取 S3
- 🚀 **自動部署**：CDK 一鍵部署網站資產
- 🔄 **CI/CD 流程**：GitHub Actions 自動化部署

## 🛠️ 開始之前

請確保你的環境已準備好：
- ✅ **Node.js 18+**（建議 20）
- ✅ **AWS CLI** 已安裝並完成 `aws configure`
- ✅ **CDK CLI**：`npm i -g aws-cdk`
- ✅ **Python 3.8+**

## 🚀 快速開始

### 1️⃣ 本機開發
```bash
# 啟動前端開發伺服器
cd website
npm install
npm run dev   # 🌐 開啟 http://localhost:5173
```

### 2️⃣ 部署到 AWS
```bash
# 另開一個終端機
cd infra_py
python -m venv .venv
.venv\Scripts\activate   # Windows PowerShell
pip install -r requirements.txt

# 首次部署需要 bootstrap
cdk bootstrap   # 🎯 只在第一次執行

# 建置並部署
cd ../website
npm run build   # 📦 產出 dist 資料夾
cd ../infra_py
cdk deploy --require-approval never   # 🚀 部署到 AWS
```

🎉 **完成！** 在輸出中找到 CloudFront 網域，開啟瀏覽器就能看到你的貓咪網站了！

## 🎨 自訂你的貓咪網站

### 透過 config.json 輕鬆調整
編輯 `website/config.json` 來客製化你的網站：

```json
{
  "title": "🎉 我的貓咪網站",
  "subtitle": "歡迎來到我的工作坊！",
  "theme": "neon",           // light, dark, neon, retro
  "stageTitle": "貓咪展示區",
  "rightPanel": "calculator", // editor 或 calculator
  "width": 640,
  "height": 480
}
```

### 🐱 可愛功能
- **主題切換**：4 種精美主題（亮色、暗色、霓虹、復古）
- **喵喵編輯器**：打字會變成喵喵語
- **貓咪計算機**：按什麼都顯示 MEOW
- **即時預覽**：調整圖片尺寸立即看到效果

## 🔄 自動化部署 (GitHub Actions)

### 設定步驟
1. 🔐 建立 GitHub OIDC IAM 角色
2. 📝 將角色 ARN 加入 repo secrets：`DEPLOY_ROLE_ARN`
3. 🌍 設定 `AWS_REGION`（預設 us-east-1）
4. 🚀 推送到 `main`/`master` 自動部署

### 工作流程
```bash
# 修改 config.json
git add website/config.json
git commit -m "更新貓咪尺寸"
git push origin main
# 🎉 GitHub Actions 自動部署！
```

## 🧹 Clean up
```bash
cd infra_py
cdk destroy --force   # 刪除所有 AWS 資源
```

## 💡 Tips
- 使用 `cdk synth` 檢查 CloudFormation 模板
- 用 `cdk diff` 查看變更內容
- 遇到問題時查看 CloudFormation 事件日誌

## 🙏 致謝

感謝 [placecat.com](https://placecat.com) 提供可愛的貓咪圖片素材，讓我們的網站更加生動有趣！🐱

---

**準備好了嗎？讓我們開始建立你的貓咪網站吧！** 🐱✨
