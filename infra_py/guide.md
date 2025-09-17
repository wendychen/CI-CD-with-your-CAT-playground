# AWS CDK Workshop 實作指南（S3 靜態網站 + CI/CD）

## 目標
建立一個「僅使用 S3 靜態網站託管」的前端網站，並透過 GitHub Actions 進行自動化部署（不使用 CloudFront/OAC）。

## 實作步驟

### 1. 建立 S3 靜態網站 Bucket
在 `website_stack.py` 中完成 S3 的設定：
- 啟用靜態網站託管：設定 `website_index_document` 與 `website_error_document`
- 開放物件公開讀取（CDK 會加上對應的 Bucket Policy）
- 建議啟用 `S3_MANAGED` 加密

### 2. 部署前端資產到 S3
使用 `s3deploy.BucketDeployment`：
- 來源目錄：`../website/dist`
- 目標儲存桶：上一步建立的 S3 Bucket
- 提醒：先在 `website/` 執行 `npm run build` 產出 `dist`

### 3. 設定 GitHub Actions（CI/CD）
Workflow 核心流程：build → `aws s3 sync` 到 S3
- 建立可被 GitHub OIDC 假設的 IAM 角色
- 在 repo secrets 設定：`DEPLOY_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET`
- 在 workflow 中執行：`npm ci && npm run build && aws s3 sync website/dist s3://$S3_BUCKET --delete`

## 提示
- 使用 `cdk deploy` 建立/更新 S3 與靜態網站設定
- S3 網站端點可在主控台的「靜態網站託管」頁面找到
- 若是 SPA，將 `website_error_document` 設為 `index.html`

## 驗證
完成後執行：
```bash
cdk synth   # 檢查 CloudFormation 模板
cdk deploy  # 建立/更新 S3 靜態網站資源
```
部署完成後：
- 前往 S3 Bucket > 靜態網站託管，找到網站端點，直接瀏覽

## 進階挑戰（可選）
- 調整 `aws s3 sync` 的快取策略與壓縮（Cache-Control、Content-Type）
- 加入 Preview/Prod 兩個 Bucket 與對應分支策略
- 在 PR 上跑 lint/build 檢查
