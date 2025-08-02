-- Grant select access to authenticated users for the workspaces table
CREATE POLICY "Allow authenticated users to read workspaces"
ON public.workspaces
FOR SELECT
TO authenticated
USING (true);
