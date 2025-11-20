# FlowMoney 数据脚本备忘

## 1. 新增/变更表结构
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard) → 进入对应项目。
2. 打开 `SQL Editor`，选择「New query」。
3. 粘贴需要执行的 `ALTER TABLE` 或 `CREATE TABLE` 语句（例如 `docs/DB_SCHEMA.sql` 中新增的字段），检查无误后点击 `Run`。
4. 到 `Table Editor` 验证字段是否生效，并根据需要补齐默认值。

> 建议在执行结构变更前，先导出当前表的数据以便回滚。

## 2. 手动设置用户为 Pro（有效期 1 天）
在 `SQL Editor` 中运行下面脚本，将 `:user_id` 替换为目标用户的 `auth.users.id`（或使用 `email` 条件）：

```sql
update public.users
set is_pro = true,
    membership_tier = 'pro',
    pro_expires_at = (now() at time zone 'utc') + interval '1 day',
    trial_started_at = now(),
    trial_ends_at = (now() at time zone 'utc') + interval '1 day',
    updated_at = now()
where email = ':user_id';
```

- 如果只知道邮箱，可改成 `where email = 'xxx@example.com';`
- 执行后刷新应用即可立即看到 Pro 状态，过期时间到达后系统会自动降级。

## 3. 其他常用操作
- **恢复为 Free**：将 `is_pro=false`, `membership_tier='free'`, `pro_expires_at=null`, `trial_*=null`。
- **批量延长有效期**：把 `interval '1 day'` 改为需要的天数（如 `7 day`、`30 day`）。

保持该文件更新，可快速复用常见脚本。***

