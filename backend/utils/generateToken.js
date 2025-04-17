import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';

export const generateTokenandsetcookie = (userid, res) => {
    try {
        // Tạo token với payload là user ID
        const token = jwt.sign({ id: userid }, ENV_VARS.JWT_SECRET, {
            expiresIn: '15d', // Token hết hạn sau 15 ngày
        });

        // Set cookie với token
        res.cookie("jwt-token", token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15 ngày
            httpOnly: true, // Chỉ cho phép truy cập cookie qua HTTP (ngăn XSS)
            sameSite: "strict", // Ngăn CSRF
            secure: ENV_VARS.NODE_ENV === 'production', // Chỉ sử dụng HTTPS trong môi trường production
        });

        return token;
    } catch (error) {
        console.error("Lỗi khi tạo token:", error);
        throw new Error("Không thể tạo token.");
    }
};