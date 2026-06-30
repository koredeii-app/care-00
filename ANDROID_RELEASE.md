# Androidアプリ 更新手順（チェックリスト）

押すだけ相談（Capacitor + Android）をGoogle Playで更新するための固定手順。
毎回これに従う。判断は不要、上から順に実行する。

## 絶対に守ること（毎回確認）

- [ ] `npx cap init` / `npx cap add android` は**絶対に実行しない**（プロジェクトの再作成・上書きになる）
- [ ] `capacitor.config.json` の `appId` は `com.koredeii.osudakesoudan` から変更しない
- [ ] `android/app/build.gradle` の `applicationId` も同上、変更しない
- [ ] 署名は必ず既存の `upload-keystore.jks` を使う（**新規作成しない**）
- [ ] `android/app/build.gradle` の `versionCode` は毎回必ず+1する（同じ番号は再アップロード不可）

---

## A. 初回セットアップ（完了済み・参考のみ・再実行しない）

このリポジトリでは以下が完了済み。**もう実行する必要はない。**

1. `npm install`（`@capacitor/core` `@capacitor/cli` `@capacitor/android`）
2. `npx cap add android`（`android/` フォルダ生成済み）
3. `capacitor.config.json` 作成（`appId`, `appName`, `webDir: "www"`）
4. `.gitignore` 作成（`node_modules/`, `www/`, `*.jks`, `key.properties` 等を除外）
5. `scripts/sync-www.js` 作成（ルートの静的ファイルを `www/` にコピーするスクリプト）
6. `@capacitor/assets` でアイコン・スプラッシュを生成済み

---

## B. 更新作業チェックリスト（毎回これを実行）

### Step 1. アプリの中身を編集する

- [ ] `index.html` / `app.js` / `style.css` など、通常通り編集する
- [ ] ブラウザで動作確認する（ローカル、またはGitHub Pages反映後）

### Step 2. care-00リポジトリにコミット・push（GitHub Pages版を先に更新）

```
git add index.html app.js style.css
git commit -m "変更内容"
git push
```

### Step 3. Androidプロジェクトに変更を反映する

```
npm run cap:sync
```

これで以下が自動実行される：
- `www/` フォルダを最新の状態に再生成（ルートファイルをコピー）
- `npx cap sync android`（`android/app/src/main/assets/public` を更新）

- [ ] エラーなく完了したことを確認する

### Step 4. バージョン番号を上げる

`android/app/build.gradle` を開き、以下を編集する。

```
versionCode 2   → 3 のように +1 する
versionName "1.0.1" → "1.0.2" のように分かりやすく上げる
```

- [ ] `versionCode` を前回より必ず大きい数にした
- [ ] `applicationId` が `com.koredeii.osudakesoudan` のままであることを確認した

### Step 5. Android StudioでAABを作成する

1. Android Studioで `care-00/android` フォルダを開く（Gradle同期完了を待つ）
2. メニュー: `Build` > `Generate Signed Bundle / APK`
3. `Android App Bundle` を選択 → Next
4. `Choose existing...` を選択（**Create new は選ばない**）
5. `upload-keystore.jks` を選択
6. Key store password / Key alias(`upload`) / Key password を入力（手入力、保存しない）
7. ビルドバリアントで `release` を選択
8. `Create` をクリック

- [ ] 生成された `.aab` の場所を確認した
  ```
  android/app/release/app-release.aab
  ```

### Step 6. Google Play Consoleにアップロード

1. Play Console → 対象アプリ → テスト（内部テスト／クローズドテスト／本番のいずれか）
2. 「新しいリリースを作成」
3. `app-release.aab` をアップロード
4. リリースノートを入力
5. 警告が出ても「難読化解除ファイル」の警告のみなら無視してよい（公開をブロックしない）
6. 保存 → 確認 → 公開

- [ ] アップロード時にバージョンコードの重複エラーが出ていないか確認した
- [ ] 公開後、テスターまたは自分の端末で動作確認した

---

## トラブル時の対処

| 症状 | 原因 | 対処 |
|------|------|------|
| 「バージョンコードはすでに使用されています」 | Step 4 を忘れた | `build.gradle` の `versionCode` を上げて Step 5 からやり直す |
| Generate Signed Bundle で `Create` が押せない | release のチェックが未選択 | ビルドバリアント一覧で `release` にチェックを入れる |
| `cap sync` でエラー | `www/` 関連の不整合 | `npm run prepare:www` を単体で実行し、エラー内容を確認する |
| アプリの中身が反映されない | Step 3 を忘れた、または順番を間違えた | Step 1〜3 の順番（編集→push→sync）を守ってやり直す |
