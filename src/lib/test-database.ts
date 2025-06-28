import { DatabaseService } from "./database";

export async function testDatabaseConnection() {
	try {
		// Test creating a session
		const session = await DatabaseService.createSession({
			session_type: "focus",
			start_time: new Date().toISOString(),
			notes: "Test session",
		});

		console.log("✅ Session created:", session);

		// Test fetching workspaces
		const workspaces = await DatabaseService.getWorkspaces();
		console.log("✅ Workspaces fetched:", workspaces);

		return true;
	} catch (error) {
		console.error("❌ Database test failed:", error);
		return false;
	}
}
