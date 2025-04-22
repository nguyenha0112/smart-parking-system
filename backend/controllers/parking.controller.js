import { BaiDoXe } from "../models/baigiuxe.model.js";


// Thêm bãi đỗ xe
export const addParking = async (req, res) => {
  try {
    const { TenBai, DiaChi, SoChoTrong } = req.body;

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
    const { parkingId, TenBai, DiaChi, SoChoTrong } = req.body;

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
      { TenBai, DiaChi, SoChoTrong },
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