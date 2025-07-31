"use client";

import React from "react";
import { FlickeringGrid } from "./magicui/flickering-grid";
import { useTheme } from "next-themes";

export default function LandingPageBackground() {
	const { resolvedTheme } = useTheme();
	const [color, setColor] = React.useState("#ffffff");

	React.useEffect(() => {
		setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
	}, [resolvedTheme]);

	return (
		<FlickeringGrid
			className="fixed inset-0 -z-50 size-full [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
			squareSize={9}
			gridGap={6}
			color={color}
			maxOpacity={0.1}
			flickerChance={0.1}
		/>
	);
}
