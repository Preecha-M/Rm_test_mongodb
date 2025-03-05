"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    const response = await fetch("http://127.0.0.1:8000/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username, password }),
    });

    if (!response.ok) {
      alert("Login failed");
      return;
    }

    const data = await response.json();
    login(data.access_token); // ใช้ Context API
    alert("Login successful!");
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-2 p-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2 p-2 border rounded" />
        <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Login</button>
      </div>
    </div>
  );
}
