import { BaiDoXe } from "../models/baigiuxe.model.js";

import { KhachHang } from "../models/khachhang.model.js";


// Thêm bãi đỗ xe
export const addParking = async (req, res) => {
  try {
    const { TenBai, DiaChi, SoChoTrong,GiaTien } = req.body;

    // Kiểm tra nếu thông tin không đầy đủ
    if (!TenBai || !DiaChi || !SoChoTrong) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin bãi đỗ xe.",
      });
    }

    // Tạo bãi đỗ xe mới
    const newParking = await BaiDoXe.create({
      TenBai,
      DiaChi,
      SoChoTrong,
      GiaTien,
    });

    res.status(201).json({
      success: true,
      message: "Thêm bãi đỗ xe thành công.",
      data: newParking,
    });
  } catch (error) {
    console.error("Lỗi khi thêm bãi đỗ xe:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi thêm bãi đỗ xe.",
    });
  }
};
// Xóa bãi đỗ xe
export const deleteParking = async (req, res) => {
  try {
    const { parkingId } = req.body;

    // Kiểm tra nếu không có ID bãi đỗ xe
    if (!parkingId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp ID bãi đỗ xe cần xóa.",
      });
    }

    // Xóa bãi đỗ xe
    const deletedParking = await BaiDoXe.findByIdAndDelete(parkingId);
    if (!deletedParking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bãi đỗ xe.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa bãi đỗ xe thành công.",
    });
  } catch (error) {
    console.error("Lỗi khi xóa bãi đỗ xe:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xóa bãi đỗ xe.",
    });
  }
};
// Cập nhật bãi đỗ xe
export const updateParking = async (req, res) => {
  try {
    const { parkingId, TenBai, DiaChi, SoChoTrong,giaTien } = req.body;

    // Kiểm tra nếu không có ID bãi đỗ xe
    if (!parkingId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp ID bãi đỗ xe cần cập nhật.",
      });
    }

    // Tìm và cập nhật bãi đỗ xe
    const updatedParking = await BaiDoXe.findByIdAndUpdate(
      parkingId,
      { TenBai, DiaChi, SoChoTrong, giaTien },
      { new: true, runValidators: true }
    );

    if (!updatedParking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bãi đỗ xe.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật bãi đỗ xe thành công.",
      data: updatedParking,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật bãi đỗ xe:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật bãi đỗ xe.",
    });
  }
};
// Tìm kiếm bãi đỗ xe theo tên, địa chỉ hoặc cả hai
export const searchParking = async (req, res) => {
  try {
    const { tenBai, diachi } = req.body;

    // Tạo điều kiện tìm kiếm
    const searchConditions = {};
    if (tenBai) {
      searchConditions.TenBai = { $regex: tenBai, $options: "i" }; // Tìm kiếm gần đúng theo tên
    }
    if (diachi) {
      searchConditions.DiaChi = { $regex: diachi, $options: "i" }; // Tìm kiếm gần đúng theo địa chỉ
    }

    // Kiểm tra nếu không có điều kiện tìm kiếm
    if (Object.keys(searchConditions).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp tên hoặc địa chỉ bãi đỗ xe để tìm kiếm.",
      });
    }

    // Tìm kiếm bãi đỗ xe theo điều kiện
    const parkingList = await BaiDoXe.find(searchConditions);

    if (parkingList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bãi đỗ xe nào phù hợp.",
      });
    }

    // Lưu lịch sử tìm kiếm vào tài khoản người dùng
    const userId = req.user?._id; // Lấy ID người dùng từ middleware protectRoute
    if (userId) {
      const searchHistory = {};
      if (tenBai) searchHistory.tenBai = tenBai;
      if (diachi) searchHistory.diachi = diachi;

      await KhachHang.findByIdAndUpdate(
        userId,
        {
          $push: { searchHistory }, // Lưu lịch sử tìm kiếm
        },
        { new: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Tìm kiếm bãi đỗ xe thành công.",
      data: parkingList,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm bãi đỗ xe:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tìm kiếm bãi đỗ xe.",
    });
  }
};
// Lấy tất cả bãi đỗ xe
export const getAllParking = async (req, res) => {
  try {
    const parkingList = await BaiDoXe.find();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách bãi đỗ xe thành công.",
      data: parkingList,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bãi đỗ xe:", error);
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách bãi đỗ xe.",
    });
  }
};