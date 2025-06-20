import { useTimerStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import React from "react";

export default function UseDynamicTitle() {
	const { focusMode, focusTime, restMode, restTime, activeTimer } =
		useTimerStore();

	React.useEffect(() => {
		const baseTitle = "Learning Backend JavaScript"; // Hardcode Project Name

		// Focus mode is running
		if (focusMode === "running" && focusTime > 0) {
			const timeString = formatTime(focusTime);
			document.title = `▶️ ${timeString} Focus - ${baseTitle}`;
		}
		// Rest mode is running
		else if (restMode === "running" && restTime > 0) {
			const timeString = formatTime(restTime);
			document.title = `▶️ ${timeString} Rest - ${baseTitle}`;
		}

		// Focus mode is paused
		else if (focusMode === "paused" && focusTime > 0) {
			const timeString = formatTime(focusTime);
			document.title = `⏸️ ${timeString} Focus - ${baseTitle}`;
		}
		// Rest mode is paused
		else if (restMode === "paused" && restTime > 0) {
			const timeString = formatTime(restTime);
			document.title = `⏸️ ${timeString} Rest - ${baseTitle}`;
		} else {
			document.title = baseTitle;
		}
	}, [focusTime, focusMode, restMode, restTime, activeTimer]);
}
