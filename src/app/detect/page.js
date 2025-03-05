"use client";
import { useState } from "react";

export default function Detect() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setResult(data.prediction);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Prediction failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4 text-black">Click To Upload Your Image</h2>
        <input type="file" onChange={handleFileChange} className="mb-4 text-black" />
        <button
          onClick={handleUpload}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
        >
          Predict
        </button>
        {result && (
          <p className="mt-4 font-bold text-green-700">Prediction: {result}</p>
        )}
      </div>
    </div>
  );
}
