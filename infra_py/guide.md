# AWS CDK Workshop 實作指南

## 目標
建立一個 S3 + CloudFront (OAC) 的靜態網站部署架構

## 實作步驟

### 1. S3 儲存桶設定
在 `website_stack.py` 中完成 S3 儲存桶的建立：
- 設定為私有儲存桶（禁止公開存取）
- 強制使用 HTTPS
- 啟用加密

### 2. CloudFront Origin Access Control (OAC)
建立 OAC 以安全地讓 CloudFront 存取 S3：
- 設定為 S3 類型
- 使用 SigV4 簽名協定
- 設定適當的名稱

### 3. CloudFront Distribution
建立 CloudFront 分發：
- 設定預設首頁為 `index.html`
- 配置快取行為（TTL、壓縮、轉發設定）
- 設定來源為 S3 儲存桶
- 附加 OAC

### 4. S3 儲存桶政策
設定 S3 政策允許 CloudFront 存取：
- 允許 `s3:GetObject` 動作
- 限制只有特定 CloudFront Distribution 可存取
- 使用條件限制來源 ARN

### 5. 網站資產部署
使用 `s3deploy.BucketDeployment` 部署網站：
- 來源目錄：`../website/dist`
- 目標儲存桶：建立的 S3 儲存桶

## 提示
- 使用 `cdk.Fn.join()` 組合 ARN 字串
- 使用 `Duration.days()` 設定快取時間
- 記得設定適當的 `viewer_protocol_policy`

## 驗證
完成後執行：
```bash
cdk synth  # 檢查 CloudFormation 模板
cdk deploy  # 部署到 AWS
```

## 進階挑戰
- 加入自訂網域
- 設定 ACM 憑證
- 加入 CloudFront 安全標頭
