// controllers/user.controller.js (continue in same file or separate verification file)
export const verifyUserEmail = async (req, res) => {
    const { email, code } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (user.verificationCode === code) {
        user.verified = true;
        user.verificationCode = undefined;  // clear the code after verification
        await user.save();
        return res.status(200).json({ success: true, message: 'Email verified successfully' });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid verification code' });
      }
    } catch (error) {
      console.error('Error verifying email:', error.message);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  