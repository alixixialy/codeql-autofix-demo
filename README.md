# CodeQL + Copilot Autofix 演示

本项目用于课堂展示一条完整流程：**CodeQL 检测 → 查看输入到输出的路径 → Copilot Autofix 生成修复及解释 → 人工审查 → 重新扫描和测试**。

这是独立构造的 Express 教学样例，不是 OWASP NodeGoat，也不用于比较工具检测率。基线代码故意保留反射型 XSS；应用仅导出 Express 对象，测试时短暂监听本机回环地址。

## 实测结果与代码来源

2026-10-11，`alixixialy` 已在本公开仓库实际获得经典 Copilot Autofix 建议。成功对象为 [`/preview` 的第 3 条告警](https://github.com/alixixialy/codeql-autofix-demo/security/code-scanning/3)，服务返回 `status: success`，解释原文保存在 [`docs/autofix-result.json`](docs/autofix-result.json)。首次对另一条告警生成失败及后续重试记录也保留在证据中。

| 版本 | 来源与验证范围 |
| --- | --- |
| [扫描基线 `da53ad6`](https://github.com/alixixialy/codeql-autofix-demo/commit/da53ad661cb65974bb8ba8fce430f3081613210e) | 两个故意保留 XSS 的接口；功能测试通过，两个安全用例失败。 |
| [原始 Autofix `5f6ef3b`](https://github.com/alixixialy/codeql-autofix-demo/commit/5f6ef3b19eda3f191b8dce5ccbad29c77c5b6139) | GitHub Autofix 只修改 `/preview`；该安全用例通过，`/greeting` 仍失败。 |
| 当前修复分支 | 助手审阅后将同样的 HTML 输出转义补充到 `/greeting`，并将安全测试加入 CI。后续修改不冒充 Autofix 原始生成内容。 |

审阅时还发现，Autofix 将 `/preview` 缺少参数时的文本从 `undefined` 改为空字符串；这里接受该变化，并增加默认值测试。助手已审阅代码差异，用户人工审阅仍待完成。验证状态和运行链接以 [`docs/verification.json`](docs/verification.json) 及 PR 检查为准。

## 代码与预期告警

基线中，`src/app.js` 的 `/greeting` 和 `/preview` 从请求参数取得不可信输入，将其直接拼入 HTML 响应。CodeQL 实际报告规则 `js/reflected-xss`；当前分支在 HTML 文本输出前使用 `escape-html` 编码。

## 本地验证

要求 Node.js 22 或更高版本。

```powershell
npm ci --ignore-scripts
npm test
npm run test:security
```

功能测试检查健康接口、两个接口的普通输入和默认值。安全回归测试检查用户提供的 HTML 是否被转义，并保留原有页面结构；**在漏洞基线上预期失败，当前修复分支应通过**。测试只使用被动 HTML 标记，不执行攻击脚本。

## GitHub 操作

1. 推送到独立公开仓库的 `main` 分支，等待 `CodeQL` 和 `Functional tests` 工作流。
2. 在仓库的 Code scanning 告警中打开 `js/reflected-xss`，记录提交号、工作流链接、告警链接和数据路径。
3. 使用经典 Copilot Autofix 生成建议，保存生成结果与解释。API 流程使用 `POST /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}/autofix`。
4. 将实际建议放到独立修复分支，审查差异；运行功能测试、安全回归测试，并等待该分支 PR 的 CodeQL 扫描。
5. 只有实际生成成功，才记录本账号已使用 Autofix；只有复查完成，才记录修复验证完成。

经典 Copilot Autofix 与 Agentic autofix 是不同流程。前者生成单次建议，后者可能调用 cloud agent 并消耗 AI credits。本项目计划验证经典流程。

## 证据与范围

证据状态见 `docs/verification.json`。待验证字段保持为空，不能把本地环境成功当作 GitHub 或 Autofix 成功。报告范围仅为这个教学样例，不推广为真实项目检测效果或所有告警的可修复性。

官方资料：[Autofix 功能和使用条件](https://docs.github.com/en/code-security/concepts/code-scanning/autofix-for-code-scanning)、[Code scanning REST API](https://docs.github.com/en/rest/code-scanning/code-scanning)、[CodeQL Action](https://github.com/github/codeql-action)。
