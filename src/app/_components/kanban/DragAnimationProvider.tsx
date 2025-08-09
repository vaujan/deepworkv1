"use client";

import React from "react";

type DragAnimationContextValue = {
	enabled: boolean;
	setEnabled: (value: boolean) => void;
};

const DragAnimationContext =
	React.createContext<DragAnimationContextValue | null>(null);

export function DragAnimationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [enabled, setEnabled] = React.useState(false);

	const value = React.useMemo(() => ({ enabled, setEnabled }), [enabled]);

	return (
		<DragAnimationContext.Provider value={value}>
			{children}
		</DragAnimationContext.Provider>
	);
}

export function useDragAnimation() {
	const ctx = React.useContext(DragAnimationContext);
	if (!ctx)
		throw new Error(
			"useDragAnimation must be used within DragAnimationProvider"
		);
	return ctx;
}
