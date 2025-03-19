"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function History() {
  const [history, setHistory] = useState([]); // 🔹 ตั้งค่าเป็น empty array แทน null
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

      // 🔹 ป้องกัน error: ตรวจสอบว่า `data` เป็น array ก่อน setHistory
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]); // ถ้าไม่ใช่ array ให้ตั้งเป็น []
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      setHistory([]); // ป้องกัน error ถ้า fetch ไม่สำเร็จ
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl text-center">
        <h2 className="text-xl font-bold mb-4 text-black">ประวัติการวิเคราะห์</h2>

        {!isLoggedIn ? (
          <div>
            <p className="text-red-500">กรุณา <strong>ลงชื่อเข้าใช้</strong> ก่อนเข้าดูข้อมูล</p>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              ไปที่หน้า <strong>ลงชื่อเข้าใช้</strong>
            </button>
          </div>
        ) : (
          <div className="w-full">
            {history.length === 0 ? (
              <p className="text-black">ไม่มีประวัติการวิเคราะห์</p>
            ) : (
              <ul className="space-y-4">
                {history.map((item, index) => (
                  <li
                    key={index}
                    className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-md flex flex-col items-center"
                  >
                    {/* แสดงรูปภาพ */}
                    <img
                      src={`http://127.0.0.1:8000${item.image_path}`} // ดึงภาพจาก API
                      alt={`Uploaded by ${item.user}`}
                      className="w-40 h-40 object-cover rounded-md mb-2 border"
                    />

                    <div className="text-center">
                      <p className="text-black font-bold">📷 {item.filename}</p>
                      <p className="text-sm text-gray-600">{new Date(item.timestamp).toLocaleString()}</p>
                      <p className="text-black text-sm">🔍 <strong>Prediction:</strong> {item.prediction}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
