"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          
          {/* เมนูด้านซ้าย */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-lg font-bold text-black">
              Rice Disease Detector
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className={`${pathname === "/" ? "text-green-500" : "text-black hover:text-green-500"}`}>
                Home
              </Link>
              <Link href="/detect" className={`${pathname === "/detect" ? "text-green-500" : "text-black hover:text-green-500"}`}>
                Detect Here!!
              </Link>
              <Link href="/rice-diseases" className={`${pathname === "/rice-diseases" ? "text-green-500" : "text-black hover:text-green-500"}`}>
                Rice Diseases
              </Link>
              <Link href="/about" className={`${pathname === "/about" ? "text-green-500" : "text-black hover:text-green-500"}`}>
                About Us
              </Link>
              <Link href="/history" className={`${pathname === "/history" ? "text-green-500" : "text-black hover:text-green-500"}`}>
                History
              </Link>
              <Link href="/profile" className={`${pathname == "/profile" ? "text-green-500" : "text-black hover:text-green-500"}`}>
                Profile
              </Link>
            </div>
          </div>

          {/* ปุ่มด้านขวา */}
          <div>
            {isLoggedIn ? (
              <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                Logout
              </button>
            ) : (
              <button onClick={() => router.push("/login")} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
                Login
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
