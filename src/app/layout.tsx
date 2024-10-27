import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathon Project",
  description: "This project seeks to create a tree diagram of SFSU classes based on the major inputted",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} flex flex-col gap-4`}>
        <h1 className="text-center text-2xl font-bold mt-4">College Course Planner</h1> {/* Centered text */}
        <hr className="border-t border-gray-300 mt-2" /> {/* Horizontal line for separation */}
        {children}
      </body>
    </html>
  );
}
