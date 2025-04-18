import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaLock, FaGift, FaRocket } from "react-icons/fa"; // Thêm icon
import intro1 from "../assets/intro1.jpg";
import intro2 from "../assets/intro2.jpg";
import intro3 from "../assets/intro3.jpg";
import intro4 from "../assets/intro4.jpg";
import intro5 from "../assets/intro5.jpg"; 

const slides = [
  {
    image: intro1,
    title: "1. Dễ dàng sử dụng và thân thiện",
    description: "Chúng tôi cung cấp giao diện dễ sử dụng và thân thiện với người dùng.",
    icon: <FaUsers className="inline mr-2 text-green-700" />,
  },
  {
    image: intro2,
    title: "2. Có thông tin chi tiết trên bản đồ di động",
    description: "Chúng tôi cung cấp thông tin chi tiết về các địa điểm trên bản đồ di động.",
    icon: <FaLock className="inline mr-2  text-green-700" />,
  },
  {
    image: intro3,
    title: "3. Tiết kiệm thời gian và công sức",
    description: "Chúng tôi giúp bạn tiết kiệm thời gian và công sức trong việc tìm kiếm thông tin.",
    icon: <FaGift className="inline mr-2 text-green-700" />,
  },
  {
    image: intro4,
    title: "4. Có các dịch vụ kèm theo",
    description: "Chúng tôi cung cấp các dịch vụ kèm theo để nâng cao trải nghiệm của bạn.",
    icon: <FaRocket className="inline mr-2  text-green-700" />,
  },
  {
    image: intro5,
    title: "5. Độ tin cậy tuyệt đối",
    description: "Chúng tôi cam kết cung cấp dịch vụ đáng tin cậy và an toàn cho người dùng.",
    icon: <FaRocket className="inline mr-2  text-green-700" />,
  },
];

 function Introduction() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <img
        src={slides[current].image}
        alt="Background"
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-3xl font-bold mb-4">
            {slides[current].icon}
            {slides[current].title}
          </h2>
          <p className="mb-6">{slides[current].description}</p>
          <button
            onClick={() => navigate("/step")}
            className="bg-yellow-300 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded"
          >
            Bắt đầu
          </button>
        </div>
      </div>
    </div>
  );
}
export default Introduction;