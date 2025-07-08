import React from "react";
import { serif } from "@/lib/fonts";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex justify-center items-center w-full min-h-screen bg-background">
			<div className="px-6 py-16 max-w-7xl text-center">
				<h1
					className={`${serif.className} text-9xl font-bold text-foreground mb-4`}
				>
					404
				</h1>
				<h2
					className={`${serif.className} text-4xl font-semibold text-foreground mb-8`}
				>
					Page Not Found
				</h2>
				<p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
					Oops! It seems like you&apos;ve ventured into uncharted territory. The
					page you&apos;re looking for doesn&apos;t exist or may have been
					moved.
				</p>
				<Link
					href="/"
					className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md border border-transparent transition-colors duration-200 text-background bg-foreground hover:bg-muted-foreground"
				>
					<svg
						className="mr-2 w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Return Home
				</Link>
			</div>
		</div>
	);
}
