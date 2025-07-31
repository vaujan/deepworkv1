// Development performance monitoring utility
interface PerformanceMetric {
	operation: string;
	startTime: number;
	endTime?: number;
	duration?: number;
	cached?: boolean;
}

class PerformanceMonitor {
	private metrics: Map<string, PerformanceMetric> = new Map();
	private enabled = process.env.NODE_ENV === "development";

	startTimer(operationId: string, operation: string) {
		if (!this.enabled) return;

		this.metrics.set(operationId, {
			operation,
			startTime: performance.now(),
		});
		console.log(`⏱️ Started: ${operation}`);
	}

	endTimer(operationId: string, cached = false) {
		if (!this.enabled) return;

		const metric = this.metrics.get(operationId);
		if (!metric) return;

		const endTime = performance.now();
		const duration = endTime - metric.startTime;

		metric.endTime = endTime;
		metric.duration = duration;
		metric.cached = cached;

		const cacheLabel = cached ? "📦 (cached)" : "🌐 (fresh)";
		const durationColor = duration < 500 ? "🟢" : duration < 1000 ? "🟡" : "🔴";

		console.log(
			`✅ ${durationColor} ${metric.operation}: ${duration.toFixed(2)}ms ${cacheLabel}`
		);

		// Clean up
		this.metrics.delete(operationId);
	}

	logSummary() {
		if (!this.enabled) return;

		console.log("\n📊 Performance Summary:");
		console.log("🟢 < 500ms (Fast)");
		console.log("🟡 500-1000ms (Medium)");
		console.log("🔴 > 1000ms (Slow)");
		console.log("📦 Cached data");
		console.log("🌐 Fresh from database\n");
	}

	// Clear all cache for testing
	clearAllCache() {
		if (!this.enabled) return;

		// Dynamically import to avoid build issues
		import("@/lib/database").then(({ DatabaseService }) => {
			DatabaseService.clearAllCache();
			console.log("🧹 Cleared all performance caches");
		});
	}
}

export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const startTimer = (operationId: string, operation: string) =>
	performanceMonitor.startTimer(operationId, operation);

export const endTimer = (operationId: string, cached = false) =>
	performanceMonitor.endTimer(operationId, cached);

export const logSummary = () => performanceMonitor.logSummary();

export const clearCache = () => performanceMonitor.clearAllCache();
