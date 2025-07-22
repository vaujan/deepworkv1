"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

interface SyncStatusContextType {
	status: SyncStatus;
	pendingOperations: Set<string>;
	startSync: (operationId?: string) => void;
	endSync: (operationId?: string, success?: boolean) => void;
	clearError: () => void;
}

const SyncStatusContext = createContext<SyncStatusContextType | undefined>(
	undefined
);

export function SyncStatusProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [status, setStatus] = useState<SyncStatus>("idle");
	const [pendingOperations, setPendingOperations] = useState(new Set<string>());

	const startSync = useCallback((operationId = "default") => {
		setPendingOperations((prev) => new Set([...prev, operationId]));
		setStatus("syncing");
	}, []);

	const endSync = useCallback((operationId = "default", success = true) => {
		setPendingOperations((prev) => {
			const newSet = new Set(prev);
			newSet.delete(operationId);
			return newSet;
		});

		// Update status based on remaining operations
		setPendingOperations((currentOperations) => {
			if (currentOperations.size === 0) {
				if (success) {
					setStatus("synced");
					// Auto-clear synced status after 2 seconds
					setTimeout(() => setStatus("idle"), 2000);
				} else {
					setStatus("error");
				}
			}
			return currentOperations;
		});
	}, []);

	const clearError = useCallback(() => {
		setStatus("idle");
	}, []);

	const value = {
		status,
		pendingOperations,
		startSync,
		endSync,
		clearError,
	};

	return (
		<SyncStatusContext.Provider value={value}>
			{children}
		</SyncStatusContext.Provider>
	);
}

export function useSyncStatus() {
	const context = useContext(SyncStatusContext);
	if (context === undefined) {
		throw new Error("useSyncStatus must be used within a SyncStatusProvider");
	}
	return context;
}

// Convenience hook for individual operations
export function useSyncOperation() {
	const { startSync, endSync } = useSyncStatus();

	const withSync = useCallback(
		async <T,>(
			operation: () => Promise<T>,
			operationId?: string
		): Promise<T> => {
			const id = operationId || `op-${Date.now()}-${Math.random()}`;

			try {
				startSync(id);
				const result = await operation();
				endSync(id, true);
				return result;
			} catch (error) {
				endSync(id, false);
				throw error;
			}
		},
		[startSync, endSync]
	);

	return { withSync };
}
