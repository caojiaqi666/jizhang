-- 移除旧的约束
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_mood_check;

-- 添加新的约束，包含所有前端支持的 mood 类型
ALTER TABLE transactions 
ADD CONSTRAINT transactions_mood_check 
CHECK (mood IN ('happy', 'neutral', 'sad', 'angry', 'anxious', 'grateful', 'regret'));

