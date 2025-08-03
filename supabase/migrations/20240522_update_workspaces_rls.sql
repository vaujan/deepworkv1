-- This policy secures the workspaces table by ensuring users can only read
-- rows where the user_id column matches their own authenticated user ID
-- AND the workspace is marked as active.
ALTER POLICY "Allow authenticated users to read workspaces"
ON public.workspaces
USING (auth.uid() = user_id AND is_active = true);
