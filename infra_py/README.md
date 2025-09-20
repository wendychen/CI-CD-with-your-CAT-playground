# 歡迎來到 AWS 社群日工作坊！

一起用最少的步驟，把你的前端網站自動部署到 AWS。放輕鬆，跟著做就好。

## 0. 前置作業（環境建置）

確保你的環境準備就緒：

**必備工具：**
- Python 3.8+ 
- Node.js 16+ (前端建置用)
- AWS CLI (已設定憑證)

```bash
# 建立 Python 虛擬環境
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 安裝相依套件
pip install -r requirements.txt

# 初始化 CDK（首次使用需要）
cdk bootstrap

#將網站靜態資源輸出
cd website
npm ci
npm run build

# 部署到 AWS
cdk deploy --require-approval never
```

## 1. 什麼是 GitHub Workflow？
GitHub Workflow 是一份 YAML 設定檔，描述「何時」與「如何」自動執行你的流程（例如：push 後自動 build 與部署）。我們會用 GitHub OIDC 讓 Workflow 以臨時角色登入 AWS，免去長期金鑰設定。

## 2. 今天的任務（依序完成即可）
- 到`https://github.com/Archong-Liu/CI-CD-with-your-CAT-playground` 將repo給fork下來！
- Open new folder 並 `git clone https://github.com/你的GitHub User name/CI-CD-with-your-CAT-playground`

> 能看到本檔案代表以上你已經完成了！


- 進入AWS Console-> IAM-> 身分供應商
- 建立 身分供應商 Identity Provider：
    - 選擇OpenID Connect   
    - 到 AWS IAM 新增 GitHub OIDC（`https://token.actions.githubusercontent.com`）。
    - Audience 新增 `sts.amazonaws.com`
    - 點擊新增

- 建立 IAM 角色：
  - 選擇Web身分
  - 信任上面的 OIDC Provider。
  - 填妥與你的Github Repo 有關的資訊(Organization 是你的GitHub User name)
  - 附上最小必要權限以部署（我們直接開到最大 Administrator Access）。
  - 接下來角色名稱等自己填即可!
  

- 複製該 IAM 角色 ARN：貼回 GitHub Actions workflow 指定位置（ `role-to-assume`）。

## 3. 調整設定並部署
- 調整 `website/config.json`（例如網站標題或必要的設定）。
- 推送到您的GitHub Repository!

```
git add website/config.json # 將 config.json 的更新 stash
git commit -m "修改為貓咪編輯器!" # 輸入適當的 commit message
git push # 將更新推送到 GitHub

```

回到 GitHub Action 檢查結果


- (本地部署必要) 本地先產出前端檔案：
```bash
cd website
npm ci
npm run build
```
- 觸發部署的兩種方式：
  
  1. GitHub Actions Workflow：
    - 將變更 commit 並 `git push` 到指定分支，Workflow 會自動使用你貼入的 IAM 角色 ARN 完成部署。
  
  2. 本地 CDK：

```bash
cd infra_py
cdk synth
cdk deploy
```

完成後，到 S3 Bucket 的「靜態網站託管」頁面查看網站端點，開心驗收吧！🎉
