# CodeQL + Copilot Autofix 演示

本项目用于课堂展示一条完整流程：**CodeQL 检测 → 查看输入到输出的路径 → Copilot Autofix 生成修复及解释 → 人工审查 → 重新扫描和测试**。

这是独立构造的 Express 教学样例，不是 OWASP NodeGoat，也不用于比较工具检测率。基线代码故意保留反射型 XSS；应用仅导出 Express 对象，测试时短暂监听本机回环地址。

## 代码与预期告警

`src/app.js` 的 `/greeting` 从 `req.query.name` 取得不可信输入，将其直接拼入 HTML 响应。预期规则为 `js/reflected-xss`。是否检出和能否获得 Autofix 建议，以实际扫描与生成结果为准。

## 本地验证

要求 Node.js 22 或更高版本。

```powershell
npm ci --ignore-scripts
npm test
npm run test:security
```

功能测试检查健康接口、普通姓名和默认姓名。安全回归测试检查用户提供的 HTML 是否被转义，并保留原有问候页面；**在漏洞基线上预期失败，完成有效修复后应通过**。测试只使用被动 HTML 标记，不执行攻击脚本。

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
