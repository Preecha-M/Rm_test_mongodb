import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "Rice Disease Detector",
  description: "ตรวจสอบโรคในใบข้าวด้วย AI",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
    </AuthProvider>
  );
}