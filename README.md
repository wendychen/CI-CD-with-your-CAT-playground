# AWS CDK Workshop - S3 + CloudFront (OAC) + GitHub Actions

本專案提供一個輕量又有趣的網站，適合在工作坊中體驗以 CDK 部署 S3 靜態網站並透過 CloudFront OAC 安全存取，同時搭配 GitHub Actions 進行 CI/CD。

## 架構重點
- S3 私有儲存桶 (Block Public Access, 強制 TLS)
- CloudFront Distribution 以 OAC 讀取 S3 (SigV4)
- CDK 自動部署 `website/` 資產至 S3
- GitHub Actions 以 OIDC 配置角色，自動執行 `cdk deploy`

## 先決條件
- Node.js 18+（建議 20）
- 已安裝 AWS CLI 並完成 `aws configure`
- 已安裝 CDK CLI：`npm i -g aws-cdk`

## 本機部署步驟（Python 版 CDK）
```bash
cd website
npm install
npm run dev   # 本機開發伺服器 (http://localhost:5173)

# 另開一個終端機以部署
cd infra_py
python -m venv .venv
.venv\Scripts\activate   # Windows PowerShell
pip install -r requirements.txt
cdk bootstrap   # 首次於該帳號/區域使用 CDK 必跑
cd ../website
npm run build   # 產出 website/dist
cd ../infra_py
cdk deploy --require-approval never
```
完成後，於輸出中找到 CloudFront 網域，開啟瀏覽器即可看到網站。

## GitHub Actions 設定
1. 建立一個可被 GitHub OIDC 假設的 IAM 角色，並將 ARN 放到 repo secrets：`DEPLOY_ROLE_ARN`。
2. 設定 `AWS_REGION`（若不設預設 `us-east-1`）。
3. 推送到 `main`/`master` 分支會自動部署（Workflow 已改為使用 `infra_py/`）。

## 以 CI/CD 更新 Placecat 圖片尺寸
- 編輯 `website/config.json` 的 `width`、`height`。
- 提交並推送到 `main`/`master`。
- Actions 自動觸發部署，CloudFront 發布後重新整理頁面即可看到新尺寸圖片。

## 清理
```bash
cd infra
npm run destroy
```

## 進階練習想法
- 加上自訂網域與 ACM 憑證
- 調整快取政策與 Error Pages（SPA 404 -> index.html）
- 在 Actions 加上建置步驟或測試
