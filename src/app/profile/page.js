"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: "",
    size: "",
    phone_number: "",
    rice_variety: "",
  });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [inputErrors, setInputErrors] = useState({});
  const [isNewFarm, setIsNewFarm] = useState(false);

  const fieldLabels = {
    location: "ตำแหน่งที่ตั้งของไร่นา",
    size: "ขนาดไร่นา (ไร่)",
    phone_number: "เบอร์โทร",
    rice_variety: "พันธุ์ข้าวที่ปลูก",
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setIsLoggedIn(false);
      router.push("/login");
      return;
    }
    setToken(storedToken);
    setIsLoggedIn(true);
    fetchFarmData(storedToken);
  }, []);

  const fetchFarmData = async (token) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/farm", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      if (data.message === "No farm data found") {
        setIsNewFarm(true);
      } else {
        setFormData(data);
        setIsNewFarm(false);
      }
    } catch (error) {
      console.error("Error fetching farm data:", error);
      setError("ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setInputErrors({ ...inputErrors, [e.target.name]: false });
  };

  const handleSaveFarm = async () => {
    let errors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] || formData[key].trim() === "") {
        errors[key] = true;
      }
    });
    setInputErrors(errors);
    if (Object.keys(errors).length > 0) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/farm", {
        method: isNewFarm ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save farm data");
      alert("บันทึกข้อมูลสำเร็จ!");
      setIsNewFarm(false);
    } catch (error) {
      console.error("Error saving farm data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleDeleteFarm = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/farm", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to delete farm data");
      alert("ลบข้อมูลฟาร์มสำเร็จ!");
      setFormData({ location: "", size: "", phone_number: "", rice_variety: "" });
      setIsNewFarm(true);
    } catch (error) {
      console.error("Error deleting farm data:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูลฟาร์ม");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <p className="text-xl font-bold text-black mb-4">ข้อมูลฟาร์มของคุณ</p>
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col">
            {Object.keys(formData).map((key) => (
              <div key={key} className="flex justify-between items-center mb-2">
                <span className="text-gray-600 w-1/3 text-left font-semibold">
                  {fieldLabels[key]}:
                </span>
                <input
                  type={key === "size" ? "number" : "text"}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className={`p-2 border rounded flex-1 ${inputErrors[key] ? "border-red-500" : ""}`}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              className="mt-4 bg-blue-500 text-white p-2 rounded"
              onClick={handleSaveFarm}
            >
              บันทึกข้อมูล
            </button>
            <button
              type="button"
              className="mt-4 bg-red-500 text-white p-2 rounded"
              onClick={handleDeleteFarm}
            >
              ลบข้อมูลฟาร์ม
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
