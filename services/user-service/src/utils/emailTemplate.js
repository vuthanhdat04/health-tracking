export const otpTemplate = (otp, name) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Xin chào ${name},</h2>
    <p>Bạn vừa yêu cầu đặt lại mật khẩu tài khoản Health Tracking.</p>

    <p>Mã OTP của bạn (hết hạn sau 5 phút):</p>

    <h1 style="letter-spacing: 4px; color: #e63946;">${otp}</h1>

    <p>Nếu bạn không yêu cầu chức năng này, xin hãy bỏ qua email này.</p>
    <br/>
    <p>Trân trọng,<br/>Health Tracking Team</p>
  </div>
`;
