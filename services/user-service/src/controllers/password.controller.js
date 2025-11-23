import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/email.js";
import { otpTemplate } from "../utils/emailTemplate.js";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // tạo OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExp = new Date(Date.now() + 5 * 60 * 1000); // 5 phút
    await user.save();

    // gửi email qua Mailtrap
    await sendEmail({
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      html: otpTemplate(otp, user.name),
    });

    return res.json({
      message: "OTP đã được gửi vào email của bạn",
    });
  } catch (err) {
    console.error("Forgot pass error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }

    // sai OTP
    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "OTP không đúng" });
    }

    // OTP hết hạn
    if (new Date() > user.resetOtpExp) {
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    // hash password mới
    const hashed = await bcrypt.hash(newPassword, 10);

    user.password = hashed;
    user.resetOtp = null;
    user.resetOtpExp = null;
    await user.save();

    return res.json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (err) {
    console.error("Reset pass error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
