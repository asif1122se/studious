import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

import AuthWrapper from "@/components/providers/AuthWrapper";
import StateWrapper from "@/components/providers/StateWrapper";
import AppWrapper from "@/components/providers/AppWrapper";
import Navbar from "@/components/Navbar";
import { TRPCProvider } from '@/components/providers/TRPCProvider';
import LayoutContent from "@/components/LayoutContent";

const font = Inter({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "studious.sh",
	description: "AI powered classroom management system",
	icons: [
		"/logo.png"
	]
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={font.className + ' h-screen relative'}>
				<TRPCProvider>
					<StateWrapper>
						<AppWrapper>
							<AuthWrapper>
								<div className="h-full w-full text-base flex flex-col">
									<Navbar />
									<LayoutContent>
										{children}
									</LayoutContent>
								</div>
							</AuthWrapper>
						</AppWrapper>
					</StateWrapper>
				</TRPCProvider>
			</body>
		</html>
	);
}
