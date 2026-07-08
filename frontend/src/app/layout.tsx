import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { ClientLayout } from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ResQAI Tactical Interface",
  description: "Neural-Enabled Disaster Response & Mission Management Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full bg-black text-white overflow-hidden selection:bg-brand/30 selection:text-white font-[Inter]`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
