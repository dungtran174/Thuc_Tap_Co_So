const vnpayConfig = {
    tmnCode: process.env.VNPAY_TMNCODE,
    hashSecret: process.env.VNPAY_HASHSECRET,
    url: process.env.VNPAY_URL,
    returnUrl: process.env.VNPAY_RETURN_URL,
};

module.exports = vnpayConfig;