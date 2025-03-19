export default function Home() {
  return (
    <div className="relative text-center text-white">
      <img 
        src="welcome-image.jpg" 
        alt="Rice Field" 
        className="w-full h-screen object-cover brightness-75" 
        style={{ filter: "blur(3px)" }} 
      />
      <div className="absolute inset-0 flex flex-col justify-center items-center backdrop-blur-[2px]">
        <h1 className="text-4xl font-bold">RICE LEAF DISEASES DETECTION</h1>
        <p className="text-lg mt-4">แพลตฟอร์มที่ช่วยคุณตรวจสอบโรคในใบข้าว</p>
        <a href="/detect" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg mt-6">
          คลิ๊กที่นี้เพื่อเริ่มวิเคราะห์
        </a>
      </div>
    </div>
  );
}
