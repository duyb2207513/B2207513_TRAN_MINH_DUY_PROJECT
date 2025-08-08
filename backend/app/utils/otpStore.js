const otps = new Map(); // Lưu OTP trong bộ nhớ

function setOtp(phone, otp) {
    otps.set(phone, { otp, expiresAt: Date.now() + 300000 }); // OTP hết hạn sau 5 phút (300000ms)
}

function verifyOtp(phone, otp) {
    const stored = otps.get(phone);
    if (!stored) return false;
    if (Date.now() > stored.expiresAt) {
        otps.delete(phone); // Xóa OTP hết hạn
        return false;
    }
    return stored.otp === otp;
}

module.exports = { setOtp, verifyOtp };