import { Geist, Instrument_Serif } from "next/font/google";

export const sansSerif = Geist({ subsets: ["latin"] });
export const serif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
});
