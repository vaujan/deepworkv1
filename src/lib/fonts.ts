import { Inter, Crimson_Pro } from "next/font/google";

export const sansSerif = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});
export const serif = Crimson_Pro({
	subsets: ["latin"],
	variable: "--font-serif",
	style: ["normal"],
});
