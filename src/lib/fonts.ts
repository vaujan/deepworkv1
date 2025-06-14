import { Geist, Instrument_Serif } from "next/font/google";

export const sansSerif = Geist({ subsets: ["latin"], variable: "--font-sans" });
export const serif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	variable: "--font-serif",
});
