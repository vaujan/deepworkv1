import { Inter, EB_Garamond } from "next/font/google";

export const sansSerif = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});
export const serif = EB_Garamond({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-serif",
});
