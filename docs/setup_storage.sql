-- Setup Supabase Storage for avatar uploads
-- 
-- ⚠️ 重要：请按照以下步骤操作
--
-- 第一步：通过 Supabase Dashboard UI 创建 bucket
-- 1. 进入 Supabase Dashboard → Storage
-- 2. 点击 "New bucket"
-- 3. 填写以下信息：
--    - Name: user-files
--    - Public: ✅ 勾选（允许公开访问）
-- 4. 点击 "Create bucket"
--
-- 第二步：在 SQL Editor 中执行以下 SQL 设置访问策略

-- 允许认证用户上传文件到 avatars 文件夹
create policy "Users can upload avatars"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'user-files' AND
  (storage.foldername(name))[1] = 'avatars'
);

-- 允许所有人读取 user-files bucket 中的文件
create policy "Public read access"
on storage.objects for select
to public
using (bucket_id = 'user-files');

-- 允许认证用户更新自己的文件
create policy "Users can update own files"
on storage.objects for update
to authenticated
using (bucket_id = 'user-files');

-- 允许认证用户删除自己的文件
create policy "Users can delete own files"
on storage.objects for delete
to authenticated
using (bucket_id = 'user-files');

