import { SupportCustomer } from '../models/supportCustomer.model.js';
import responses from '../chatbot.json' assert { type: 'json' };

export async function createSupport(req, res) {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin',
      });
    }

    const supportTicket = new SupportCustomer({
      userId: req.user.id,
      subject,
      message,
    });

    await supportTicket.save();

    res.status(201).json({
      success: true,
      message: 'Hỗ trợ đã được tạo thành công',
      data: supportTicket,
    });
  } catch (error) {
    console.error('Lỗi khi tạo hỗ trợ:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo hỗ trợ',
    });
  }
}

// Xem tất cả yêu cầu hỗ trợ của chính người dùng
export const getMySupport = async (req, res) => {
  try {
    const tickets = await SupportCustomer.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách yêu cầu hỗ trợ.',
      error: error.message,
    });
  }
};

// Xem tất cả yêu cầu (admin)
export const getAllSupport = async (req, res) => {
  try {
    const tickets = await SupportCustomer.find()
      .populate('userId', 'email fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy toàn bộ yêu cầu hỗ trợ.',
      error: error.message,
    });
  }
};

// Thay đổi trạng thái và phản hồi của yêu cầu hỗ trợ (admin)
export const updateSupportStatus = async (req, res) => {
  try {
    const { supportId } = req.params;
    const { status, adminReply } = req.body;

    const validStatuses = ['pending', 'in-progress', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ.',
      });
    }

    const support = await SupportCustomer.findById(supportId);
    if (!support) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy yêu cầu hỗ trợ.',
      });
    }

    // Cập nhật nếu có truyền vào
    if (status) support.status = status;
    if (adminReply !== undefined) support.adminReply = adminReply;

    await support.save();

    res.status(200).json({
      success: true,
      message: 'Yêu cầu hỗ trợ đã được cập nhật.',
      data: support,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật yêu cầu hỗ trợ.',
      error: error.message,
    });
  }
};

export const chatbotReply = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Vui lòng nhập tin nhắn' });
  }

  const msg = message.toLowerCase();
  let reply = 'Xin lỗi, tôi chưa hiểu ý bạn. Vui lòng liên hệ nhân viên hỗ trợ.';

  for (const keyword in responses) {
    if (msg.includes(keyword)) {
      reply = responses[keyword];
      break;
    }
  }

  return res.json({
    success: true,
    reply,
  });
};
