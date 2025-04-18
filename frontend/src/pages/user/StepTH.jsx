import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbMapPinSearch } from "react-icons/tb";
import {
  FaUserCircle,
  FaChartLine,
  FaCogs,
  FaQrcode,
  FaHistory,
  FaPlay,
  
} from "react-icons/fa";
import { MdOutlineNavigateNext } from "react-icons/md";
const steps = [
  {
    id: 1,
    title: "BƯỚC 1",
    desc: "Đăng nhập vào tài khoản cá nhân, hoặc tạo tài khoản mới nếu bạn là người dùng mới",
    icon: <FaUserCircle />,
    x: "10%",
    y: "40%",
  },
  {
    id: 2,
    title: "BƯỚC 2",
    desc: "Thêm thông tin xác thực tài khoản người dùng và chi tiết về xe của bạn",
    icon: <FaCogs />,
    x: "30%",
    y: "55%",
  },
  {
    id: 3,
    title: "BƯỚC 3",
    desc: "Tím kiếm bãi đỗ trên bản đồ, chọn bãi đỗ phù hợp với bạn, xem thông tin chi tiết chỗ trống",
    icon: <TbMapPinSearch />,
    x: "47%",
    y: "40%",
  },
  {
    id: 4,
    title: "BƯỚC 4",
    desc: "Sử dụng mã QR được cung cấp đến vị trí bãi để xác nhận",
    icon: <FaQrcode />,
    x: "70%",
    y: "50%",
  },
  {
    id: 5,
    title: "BƯỚC 5",
    desc: "Di chuyển xe theo vị trị trên ứng dụng",
    icon: <FaHistory />,
    x: "90%",
    y: "35%",
  },
];

export default function StepTH() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    navigate("/login");
  };

  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className="relative w-full h-screen bg-[url('./assets/intro4.jpg')] bg-cover overflow-hidden text-white flex flex-col items-center ">
      <h1 className="text-center text-3xl font-bold pt-6 drop-shadow-md">
        HƯỚNG DẪN SỬ DỤNG ỨNG DỤNG
      </h1>

      <svg className="absolute w-full h-full pointer-events-none z-0">
        <polyline
          fill="none"
          stroke="#fff176"
          strokeWidth="4"
          strokeDasharray="10,10"
          points={steps
            .map(
              (s) =>
                `${(parseFloat(s.x) / 100) * window.innerWidth},${
                  (parseFloat(s.y) / 100) * window.innerHeight
                }`
            )
            .join(" ")}
        />
      </svg>

      {steps.map((step) => (
        <div
          key={step.id}
          className={`absolute z-10 flex flex-col items-center transition-all duration-500 ${
            currentStep >= step.id
              ? "opacity-100 scale-100"
              : "opacity-70 scale-90"
          }`}
          style={{
            top: step.y,
            left: step.x,
            transform: "translate(-50%, -50%)",
          }}
        >
          {currentStep === step.id && (
            <div className="absolute bottom-20 w-64 shadow-orange-200  p-4 bg-black text-white opacity-80 border border-gray-300 rounded-xl shadow-xl text-sm animate-fade-in items-center">
              <h3 className="font-semibold text-base mb-2">{step.title}</h3>
              <p className="mb-3">{step.desc}</p>
              {step.id < steps.length && (
                <button
                  onClick={handleNext}
                  className="bg-green-700 text-white px-4 py-1 rounded hover:bg-yellow-400 text-sm flex items-center gap-2"
                >
                  Tiếp theo
                  <MdOutlineNavigateNext />
                </button>
              )}
              {step.id === steps.length && (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                >
                  <FaPlay /> Bắt đầu ngay
                </button>
              )}
            </div>
          )}
          <div
            className={`w-14 h-14 rounded-full border-2 border-black text-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform ${
              currentStep === step.id ? "bg-yellow-400" : "bg-green-600"
            }`}
            onClick={() => setCurrentStep(step.id)}
          >
            {step.icon}
          </div>
          <div className="mt-1 text-xs font-semibold text-center">
            {step.title}
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 w-full flex justify-center">
        {currentStep < steps.length && (
          <button
            onClick={handleSkip}
            className="bg-yellow-600 h-10 w-40 text-white text-sm hover:text-black"
          >
            Bỏ qua
          </button>
        )}
        {currentStep === steps.length && (
          <button
            onClick={handleStart}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-base"
          >
            <FaPlay className="inline mr-2" /> Bắt đầu ngay
          </button>
        )}
      </div>
    </div>
  );
}
