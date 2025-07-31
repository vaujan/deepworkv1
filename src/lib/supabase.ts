import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey =
	process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
	throw new Error("Missing Supabase environment variables");
}

// Singleton pattern to prevent multiple client instances
let supabaseInstance: SupabaseClient | null = null;
let supabaseAdminInstance: SupabaseClient | null = null;

function createSupabaseClient() {
	if (!supabaseInstance) {
		supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!, {
			auth: {
				persistSession: true,
				detectSessionInUrl: true,
			},
		});
	}
	return supabaseInstance;
}

function createSupabaseAdmin() {
	if (!supabaseAdminInstance) {
		supabaseAdminInstance = createClient(
			supabaseUrl!,
			supabaseServiceRoleKey!,
			{
				auth: {
					persistSession: false,
				},
			}
		);
	}
	return supabaseAdminInstance;
}

export const supabase = createSupabaseClient();
export const supabaseAdmin = createSupabaseAdmin();
