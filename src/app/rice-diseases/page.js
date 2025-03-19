"use client"; // ✅ บอกให้ Next.js ใช้โหมด Client Component

import { useEffect, useState } from "react";

export default function RiceDiseases() {
  const [diseases, setDiseases] = useState({});

  useEffect(() => {
    fetch("http://localhost:8000/disease_info") // เปลี่ยนเป็น URL ที่ถูกต้องของ FastAPI
      .then((response) => response.json())
      .then((data) => setDiseases(data))
      .catch((error) => console.error("Error fetching disease data:", error));
  }, []);

  return (
    <div className="min-h-screen bg-green-100 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
          🌾 ข้อมูลโรคข้าว 🌾
        </h2>

        {Object.keys(diseases).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(diseases).map(([diseaseName, details]) => (
              <div key={diseaseName} className="p-4 bg-green-50 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-green-800">{details.disease_name_th} ({diseaseName})</h3>
                <p className="text-gray-700 mt-2">
                  <strong className="text-gray-700">สาเหตุ:</strong> {details.cause}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong className="text-gray-700">การแพร่กระจาย:</strong> {details.transmission}
                </p>

                <div className="mt-2">
                  <strong className="text-gray-700">อาการ:</strong>
                  <ul className="list-disc pl-6 text-gray-700">
                    {details.symptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2">
                  <strong className="text-gray-700" >วิธีป้องกัน:</strong>
                  <ul className="list-disc pl-6 text-gray-700">
                    {details.prevention.map((prevention, index) => (
                      <li key={index}>{prevention}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-2">
                  <strong className="text-gray-700">การรักษา:</strong>
                  <ul className="list-disc pl-6 text-gray-700">
                    {details.treatment.map((treatment, index) => (
                      <li key={index}>{treatment}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">กำลังโหลดข้อมูล...</p>
        )}
      </div>
    </div>
  );
}
