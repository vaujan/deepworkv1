-- This policy secures the workspaces table by ensuring users can only read
-- rows where the user_id column matches their own authenticated user ID.
-- It alters the existing, insecure policy.
ALTER POLICY "Allow authenticated users to read workspaces"
ON public.workspaces
USING (auth.uid() = user_id);
