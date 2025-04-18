import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPModal from "../components/OTPModal"; // Đường dẫn đến OTPModal


function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Mật khẩu không khớp.");
      return;
    }

    // Gọi hộp OTP khi hợp lệ
    setShowOTP(true);
  };
    // Gọi API để gửi OTP đến email, sau đó mở modal
    
    // Giả lập gửi OTP thành công
  const handleOTPConfirmed = () => {
    localStorage.setItem("user", JSON.stringify({ email }));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Đăng ký</h2>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded transition duration-200"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-green-700 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>

      {/* OTP modal */}
      {showOTP && (
        <OTPModal
          email={email}
          onConfirm={handleOTPConfirmed}
          onClose={() => setShowOTP(false)}
        />
      )}
    </div>
  );
}

export default SignupPage;
