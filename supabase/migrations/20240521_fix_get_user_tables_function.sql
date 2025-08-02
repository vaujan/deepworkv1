-- Recreate the function with SECURITY DEFINER to run with higher privileges
-- while still checking permissions for the calling user (session_user).
CREATE OR REPLACE FUNCTION get_user_tables()
RETURNS TABLE (table_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT t.table_name
  FROM information_schema.tables t
  WHERE
    t.table_schema = 'public' AND
    t.table_type = 'BASE TABLE' AND
    pg_catalog.has_table_privilege(
      session_user, -- Check privileges for the user who called the function
      quote_ident(t.table_schema) || '.' || quote_ident(t.table_name),
      'SELECT'
    );
END;
$$;
