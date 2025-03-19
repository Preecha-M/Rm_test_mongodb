"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function CheckNearbyFarms() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [affectedFarms, setAffectedFarms] = useState([]);

    const checkNearbyFarms = async () => {
        setLoading(true);
        setMessage("");
        setAffectedFarms([]);

        try {
            const token = localStorage.getItem("token");

            // ✅ เรียก API เพื่อดึงพิกัดของฟาร์มของผู้ใช้
            const farmResponse = await axios.get("http://localhost:8000/farm", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!farmResponse.data.latitude || !farmResponse.data.longitude) {
                setMessage("❌ ไม่พบข้อมูลพิกัดของไร่นา กรุณาเพิ่มข้อมูลฟาร์มของคุณ");
                setLoading(false);
                return;
            }

            const { latitude, longitude } = farmResponse.data;

            // ✅ เรียก API เพื่อตรวจสอบไร่นาที่มีโรคใกล้เคียง
            const response = await axios.get("http://localhost:8000/notify_nearby_farms", {
                params: { lat: latitude, lon: longitude },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.affected_farms.length > 0) {
                setAffectedFarms(response.data.affected_farms);
                setMessage("⚠️ มีไร่นาใกล้เคียงที่พบโรค!");
            } else {
                setMessage("✅ ไม่มีไร่นาที่ตรวจพบโรคในระยะ 10 กิโลเมตร");
            }
        } catch (error) {
            console.error("Error fetching nearby farms:", error);
            setMessage("❌ ไม่สามารถตรวจสอบข้อมูลได้ กรุณาลองใหม่");
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">🔍 ตรวจสอบไร่นาใกล้เคียง</h2>
                <p className="text-gray-600 mb-4">กดปุ่มด้านล่างเพื่อตรวจสอบว่าไร่นาของคุณอยู่ใกล้กับไร่นาที่พบโรคหรือไม่</p>
                <button
                    onClick={checkNearbyFarms}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
                    disabled={loading}
                >
                    {loading ? "กำลังตรวจสอบ..." : "🔎 ตรวจสอบไร่นา"}
                </button>

                {message && <p className="mt-4 text-lg">{message}</p>}

                {affectedFarms.length > 0 && (
                    <div className="mt-4 w-full">
                        <h3 className="text-xl font-semibold mb-2">🚨 รายการไร่นาที่ได้รับผลกระทบ</h3>
                        <ul className="bg-red-100 p-4 rounded-lg">
                            {affectedFarms.map((farm, index) => (
                                <li key={index} className="border-b border-gray-300 py-2">
                                    📍 <strong>{farm.location}</strong>  
                                    - 📞 {farm.phone_number}  
                                    - 🏠 อยู่ห่าง {farm.distance_km} กม.  
                                    - 🦠 พบโรค: <strong className="text-red-600">{farm.last_disease_detected}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
