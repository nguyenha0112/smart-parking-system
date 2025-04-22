import { TaiKhoan } from "../models/taikhoan.model.js";
import { History } from '../models/historyAccount.model.js';
import { Notification } from '../models/notification.model.js';
import { FavoriteParking } from '../models/favoriteParking.js';
import {BaiDoXe} from '../models/baigiuxe.model.js'
import { protect } from "../middleware/protect.js"; 

// 1. Lưu lịch sử hoạt động
export async function saveHistory(req, res) {
  try {
    const { action, timestamp } = req.body;
    const { user } = req; // Lấy thông tin người dùng từ middleware protect

    if (!action) {
      return res.status(400).json({ message: 'Action is required.' });
    }

    const history = await History.create({
      userId: user._id, // Sử dụng user._id đã có từ middleware
      action,
      timestamp: timestamp || Date.now(),
    });

    res.status(201).json({ message: 'History saved successfully.', history });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ message: 'Failed to save history.', error: error.message });
  }
}


// 2. Cập nhật thông tin cá nhân
export async function updateProfile(req, res) {
  try {
    const updateData = req.body;
    const { user } = req; // user đã được gắn từ middleware protect

    // Kiểm tra thông tin đầu vào
    if (!updateData) {
      return res.status(400).json({ message: 'Update data is required.' });
    }

    const updatedUser = await TaiKhoan.findByIdAndUpdate(user._id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated successfully.', updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Failed to update user profile.', error: error.message });
  }
}

// 3. Lấy thông báo cá nhân
export async function getNotifications(req, res) {
  try {
    const { user } = req; // Lấy thông tin người dùng từ middleware protect

    const notifications = await Notification.find({ userId: user._id }).sort({ createdAt: -1 });

    if (!notifications.length) {
      return res.status(404).json({ message: 'No notifications found.' });
    }

    res.status(200).json({ message: 'Notifications retrieved successfully.', notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Failed to fetch notifications.', error: error.message });
  }
}



// 4. Lưu bãi đỗ xe yêu thích
export async function saveFavoriteParking(req, res) {
  try {
    const { parkingId } = req.body;
    const { user } = req; // Lấy thông tin người dùng từ middleware protect

    if (!parkingId) {
      return res.status(400).json({ message: 'ParkingId is required.' });
    }

    const favorite = await FavoriteParking.create({
      userId: user._id, // Sử dụng user._id đã có từ middleware
      parkingId,
    });

    res.status(201).json({ message: 'Favorite parking saved successfully.', favorite });
  } catch (error) {
    console.error('Error saving favorite parking:', error);
    res.status(500).json({ message: 'Failed to save favorite parking.', error: error.message });
  }
}


// 5. Tạo thông báo mẫu (test)
export async function createTestNotification(req, res) {
  try {
    const { user } = req; // Lấy thông tin người dùng từ middleware protect

    const notification = await Notification.create({
      userId: user._id, // Sử dụng user._id đã có từ middleware
      title: "🔔 Welcome!",
      content: "Cảm ơn bạn đã sử dụng ứng dụng quản lý bãi đỗ xe.",
      createdAt: new Date()
    });

    res.status(201).json({ message: "Thông báo mẫu đã được tạo.", notification });
  } catch (error) {
    console.error("Lỗi khi tạo thông báo mẫu:", error);
    res.status(500).json({ message: "Không thể tạo thông báo mẫu.", error: error.message });
  }
}





