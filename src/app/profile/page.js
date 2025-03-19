"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


const mapContainerStyle = { width: "100%", height: "300px" };

export default function Profile() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    location: "",
    size: "",
    phone_number: "",
    rice_variety: "",
    latitude: 13.736717, // Default กรุงเทพ
    longitude: 100.523186, // Default Longitude
  });

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNewFarm, setIsNewFarm] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchFarmData(storedToken);
  }, []);

  const fetchFarmData = async (token) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/farm", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFarm = async () => {
    const formattedData = {
      ...formData,
      size: parseFloat(formData.size) || 0, // ✅ แปลงให้เป็น float
    };

    console.log("📤 Sending farm data:", formattedData); // ✅ ตรวจสอบค่าก่อนส่ง

    try {
      const response = await fetch("http://127.0.0.1:8000/farm", {
        method: isNewFarm ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save farm data: ${errorText}`);
      }

      alert("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      console.error("🔥 Error saving farm data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  function UpdateMapCenter({ latitude, longitude }) {
    const map = useMap();
    useEffect(() => {
      map.setView([latitude, longitude], map.getZoom());
    }, [latitude, longitude, map]);
    return null;
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]} />
    ) : null;
  }
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
  return (
    <div className="h-screen flex justify-center items-center bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <p className="text-xl font-bold text-black mb-4">ข้อมูลไร่นาของคุณ</p>

        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : (
          <>
            <div className="flex flex-col">
              {/* ✅ ช่องกรอกตำแหน่งที่ตั้ง */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 w-1/3 text-left font-semibold">
                  ตำแหน่งที่ตั้ง:
                </span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="p-2 border rounded flex-1"
                  required
                />
              </div>

              {/* ✅ ช่องกรอกขนาดไร่ */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 w-1/3 text-left font-semibold">
                  ขนาดไร่:
                </span>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                  className="p-2 border rounded flex-1"
                  required
                />
              </div>

              {/* ✅ ช่องกรอกเบอร์โทร */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 w-1/3 text-left font-semibold">
                  เบอร์โทร:
                </span>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  className="p-2 border rounded flex-1"
                  required
                />
              </div>

              {/* ✅ ช่องกรอกพันธุ์ข้าว */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 w-1/3 text-left font-semibold">
                  พันธุ์ข้าว:
                </span>
                <input
                  type="text"
                  name="rice_variety"
                  value={formData.rice_variety}
                  onChange={(e) =>
                    setFormData({ ...formData, rice_variety: e.target.value })
                  }
                  className="p-2 border rounded flex-1"
                  required
                />
              </div>

              {/* ✅ แผนที่สำหรับเลือกตำแหน่ง */}
              <div className="mb-4">
                <MapContainer
                  center={[formData.latitude, formData.longitude]}
                  zoom={15}
                  style={mapContainerStyle}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <UpdateMapCenter
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                  />
                  <LocationMarker />
                </MapContainer>
              </div>

              {/* ✅ ปุ่มบันทึก */}
              <button
                className="mt-4 bg-blue-500 text-white p-2 rounded"
                onClick={handleSaveFarm}
              >
                บันทึกข้อมูล
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
