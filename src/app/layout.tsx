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
      <div className="flex justify-center mt-4">
  <h1 className="text-2xl font-bold text-black px-3 py-1 border border-white-600 rounded-md inline-block">
    College Course Planner
  </h1>
</div>
      {/* Centered text */}
        <hr className="border-t border-gray-300 mt-2" /> {/* Horizontal line for separation */}
        {children}
      </body>
    </html>
  );
}
