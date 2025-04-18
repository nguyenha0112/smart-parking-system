import { useEffect, useRef, useState } from "react";

function OTPModal({ email, onConfirm, onClose }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);

  // Bắt đầu đếm ngược
  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  // Xử lý nhập
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Xử lý paste
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      const newOtp = paste.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  // Di chuyển lùi khi nhấn Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Gửi lại mã
  const handleResend = () => {
    setOtp(new Array(6).fill(""));
    setTimer(60);
    // TODO: Gửi lại mã OTP đến email
    console.log("Đã gửi lại mã đến", email);
  };

  // Xác nhận OTP
  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      alert("Vui lòng nhập đầy đủ 6 số OTP.");
      return;
    }

    if (enteredOtp === "123456") {
      onConfirm(enteredOtp);
      window.location.href = "/login";
    } else {
      alert("Mã OTP không đúng. Vui lòng thử lại.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-semibold text-center mb-2">Xác minh OTP</h2>
        <p className="text-sm text-gray-400 mb-4 text-center">
          Mã xác nhận đã gửi đến <span className="text-yellow-400">{email}</span>
        </p>

        {/* Các ô nhập OTP */}
        <div className="flex justify-center gap-2 mb-4" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-10 h-12 text-center rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
            />
          ))}
        </div>

        {/* Bộ đếm thời gian hoặc gửi lại */}
        <div className="text-center text-sm text-gray-400 mb-4">
          {timer > 0 ? (
            <p>Gửi lại mã sau <span className="text-yellow-400">{timer}s</span></p>
          ) : (
            <button onClick={handleResend} className="text-yellow-400 hover:underline">
              Gửi lại mã
            </button>
          )}
        </div>

        {/* Nút xác nhận và hủy */}
        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-semibold w-full mr-2"
          >
            Xác nhận
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:underline px-4 py-2"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTPModal;
