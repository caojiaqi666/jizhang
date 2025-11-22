-- 初始化系统默认分类数据

INSERT INTO categories (user_id, name, icon, color, type, is_default) VALUES
-- 支出分类
(NULL, '餐饮', 'food', 'bg-orange-100 text-orange-600', 'expense', TRUE),
(NULL, '交通', 'transport', 'bg-blue-100 text-blue-600', 'expense', TRUE),
(NULL, '购物', 'shopping', 'bg-pink-100 text-pink-600', 'expense', TRUE),
(NULL, '娱乐', 'entertainment', 'bg-purple-100 text-purple-600', 'expense', TRUE),
(NULL, '医疗', 'health', 'bg-red-100 text-red-600', 'expense', TRUE),
(NULL, '居住', 'housing', 'bg-indigo-100 text-indigo-600', 'expense', TRUE),
(NULL, '学习', 'education', 'bg-yellow-100 text-yellow-600', 'expense', TRUE),
(NULL, '运动', 'fitness', 'bg-green-100 text-green-600', 'expense', TRUE),
(NULL, '旅行', 'travel', 'bg-sky-100 text-sky-600', 'expense', TRUE),
(NULL, '其他', 'other', 'bg-gray-100 text-gray-600', 'expense', TRUE),

-- 收入分类
(NULL, '工资', 'salary', 'bg-teal-100 text-teal-600', 'income', TRUE),
(NULL, '奖金', 'bonus', 'bg-amber-100 text-amber-600', 'income', TRUE);

