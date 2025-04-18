import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from "react-icons/fa"; // Thêm icon

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Đăng nhập data BE tk sau


    //Mẫu đăng nhập giả lập
    if (email === "thuong215204@gmail.com" && password === "12345") {
      localStorage.setItem("user", JSON.stringify({ email }));
      navigate("/home");
    } else {
      setErrorMsg("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          <FaSignInAlt className="text-green-700" />
          Đăng nhập
        </h2>

        {errorMsg && (
          <p className="text-red-500 text-center mb-4">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full pl-10 p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded transition duration-200"
          >
            <div className="flex items-center justify-center gap-2">
              <FaSignInAlt />
              Đăng nhập
            </div>
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Chưa có tài khoản?{" "}
          <a href="/signup" className="text-green-700 hover:underline flex items-center justify-center gap-1">
            <FaUserPlus /> Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
