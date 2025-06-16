import { create } from "zustand";

interface TimerState {
	focusSeconds: number;
	restSeconds: number;
	isRunning: boolean;
	setIsRunning: () => void;
	decreaseFocusSeconds: (by: number) => void;
	decreaseRestSeconds: (by: number) => void;
}

export const useTimerStore = create<TimerState>()((set) => ({
	focusSeconds: 3,
	restSeconds: 3,
	isRunning: false,

	setIsRunning: () => set((state) => ({ isRunning: !state.isRunning })),

	decreaseFocusSeconds: (by) =>
		set((state) => ({ focusSeconds: state.focusSeconds - by })),
	decreaseRestSeconds: (by) =>
		set((state) => ({ restSeconds: state.restSeconds - by })),
}));
