---
description: 'リリース用プルリクエスト作成'
argument-hint: '[--base <ブランチ名>] [指示内容(オプション)]'
allowed_tools: mcp__github__create_pull_request, Bash(gh pr:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git branch:*), Bash(git push:*), Bash(git rev-parse:*), Write, Read
---

## プルリクエストの作成

developブランチからmasterブランチに向けてプルリクエストを作成する。
その際に、ghコマンドを使用する

## 手順

1. 現在のブランチと変更内容を確認する
   - `git status` で現在のブランチとステータスを確認
   - `git diff <base-branch>...HEAD` で `<base-branch>` からの変更差分を確認
   - `git log <base-branch>..HEAD --oneline` でコミット履歴を確認
2. PR内容を作成する
   - タイトル: yyyy/mm/ddリリース分（yyyy/mm/ddには本日の日付を入力する）
   - 本文: ここまでマージされたプルリクエストやコミットメッセージ、差分を読み、変更内容を箇条書きで書く
3. PRを作成する
   - MCPツール(`mcp__github__create_pull_request`)を優先的に使用し、`andmohiko/smarepo` リポジトリに `<base-branch>` に対してPRを作成する
     - **CRITICAL: `body` パラメータには `\n` エスケープシーケンスを使わず、実際の改行文字を含む複数行文字列を渡すこと。**
   - MCP経由で失敗した場合のみ、`gh pr create` コマンドを使用する
     - `--body-file` オプションでファイル経由で本文を渡す
4. PR作成完了後、URLをユーザーに返す
