// Simple test script to verify database operations
// Run this in the browser console to test the fixes

import { DatabaseService } from "./database";

export async function testWorkspaceBoard(workspaceId: string) {
	console.log("🧪 Testing workspace board functionality...");
	console.log("📝 Testing workspace ID:", workspaceId);

	try {
		// Test 1: Get or create board
		console.log("\n1️⃣ Testing getOrCreateWorkspaceBoard...");
		const board = await DatabaseService.getOrCreateWorkspaceBoard(workspaceId);

		if (board) {
			console.log("✅ Board loaded successfully:", {
				id: board.id,
				name: board.name,
				workspace_id: board.workspace_id,
				columns: board.columns.length,
				cards: board.columns.reduce(
					(total, col) => total + col.cards.length,
					0
				),
			});
		} else {
			console.log("❌ Failed to load board");
			return;
		}

		// Test 2: Test caching
		console.log("\n2️⃣ Testing cache...");
		await DatabaseService.getOrCreateWorkspaceBoard(workspaceId);
		console.log('Should see "Using cached board data" message above');

		// Test 3: Clear cache and reload
		console.log("\n3️⃣ Testing cache invalidation...");
		DatabaseService.clearAllCache();
		await DatabaseService.getOrCreateWorkspaceBoard(workspaceId);
		console.log('Should see "Loading fresh board data" message above');

		console.log("\n✅ All tests completed successfully!");
		return board;
	} catch (error) {
		console.error("❌ Test failed:", error);
		throw error;
	}
}

// Convenience function to test with current URL
export function testCurrentWorkspace() {
	const path = window.location.pathname;
	const match = path.match(/\/workspace\/([^/]+)/);

	if (match) {
		const workspaceId = match[1];
		return testWorkspaceBoard(workspaceId);
	} else {
		console.log(
			"❌ Not on a workspace page. Navigate to /workspace/[id] first"
		);
		return null;
	}
}

// Run automatically if in development
if (process.env.NODE_ENV === "development") {
	// Make functions available globally for console testing
	(
		window as unknown as {
			testWorkspaceBoard: typeof testWorkspaceBoard;
			testCurrentWorkspace: typeof testCurrentWorkspace;
		}
	).testWorkspaceBoard = testWorkspaceBoard;
	(
		window as unknown as {
			testWorkspaceBoard: typeof testWorkspaceBoard;
			testCurrentWorkspace: typeof testCurrentWorkspace;
		}
	).testCurrentWorkspace = testCurrentWorkspace;

	console.log("🧪 Database test functions available:");
	console.log("- testCurrentWorkspace() - Test current workspace");
	console.log('- testWorkspaceBoard("workspace-id") - Test specific workspace');
}
