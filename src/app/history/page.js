"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);
    fetchHistory(token);
  }, []);

  const fetchHistory = async (token) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        return;
      }

      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 text-center">
        <h2 className="text-xl font-bold mb-4 text-black">Prediction History</h2>

        {!isLoggedIn ? (
          <div>
            <p className="text-red-500">กรุณา Login ก่อนเข้าดูข้อมูล</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded mt-4"
            >
              ไปที่หน้า Login
            </button>
          </div>
        ) : (
          <ul>
            {history.length === 0 ? (
              <p>ไม่มีประวัติการพยากรณ์</p>
            ) : (
              history.map((item, index) => (
                <li key={index} className="border-b py-2 text-black">
                  <strong>{item.user}:</strong> {item.image_filename} → {item.prediction}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
