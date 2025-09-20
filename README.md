# 🎉 歡迎來到 AWS CDK 工作坊！

> 一起來建立一個可愛的貓咪網站，學習「S3 靜態網站託管 + GitHub Actions CI/CD」的完整流程！

## 🌟 這個工作坊會學到什麼？

- **AWS CDK**：用 Python 程式碼定義 S3 靜態網站環境
- **S3 靜態網站託管**：直接以 S3 提供網站內容
- **GitHub Actions**：自動化 CI/CD，同步前端資產到 S3
- **前端開發**：Vite + 主題切換 + 可愛的貓咪功能

## 🏗️ 架構亮點
- 🗄️ **S3 靜態網站託管**：設定 `index.html`/錯誤頁，直接對外提供網站
- 🌐 **公開讀取（僅物件）**：使用 Bucket Policy 開放網站檔案的 GET 存取
- 🚀 **自動部署**：前端 build 後自動同步到 S3
- 🔄 **CI/CD 流程**：GitHub Actions 以 OIDC/角色，執行 `aws s3 sync`

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

### 2️⃣ 建立/更新基礎設施（S3 Bucket）
```bash
# 另開一個終端機
cd infra_py
python -m venv .venv
.venv\Scripts\activate   # Windows PowerShell
pip install -r requirements.txt

# 首次部署需要 bootstrap
cdk bootstrap   # 🎯 只在第一次執行

# 建立/更新 S3 靜態網站資源
cdk deploy --require-approval never   # 🚀 建立 S3 與靜態網站設定
```

📝 部署完成後：
- 前往 S3 主控台 > 你的 Bucket > 靜態網站託管，找到「網站端點（Website endpoint）」
- 或在後續 CI/CD 完成後，直接用該端點瀏覽你的網站

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
1. 🔐 建立可被 GitHub OIDC 假設的 IAM 角色（具備 `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`）
2. 📝 在 repo secrets 設定：
   - `DEPLOY_ROLE_ARN`：上一步建立的角色 ARN
   - `AWS_REGION`：如 `us-east-1`
   - `S3_BUCKET`：你的網站 Bucket 名稱
3. 🚀 推送到 `main`/`master` 會自動：build 前端 → `aws s3 sync` 到 S3

### 工作流程
```bash
# 修改網站內容（例如 config.json）
git add website/config.json
git commit -m "更新貓咪尺寸"
git push origin main
# 🎉 GitHub Actions：npm ci && npm run build && aws s3 sync website/dist s3://$S3_BUCKET --delete
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

感謝 [placecat.com](https://placecat.com) 提供可愛的貓咪圖片素材，讓體驗更加生動有趣！🐱

---

**準備好了嗎？讓我們開始建立你的貓咪網站吧！** 🐱✨
