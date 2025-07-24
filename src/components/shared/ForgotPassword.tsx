import axios from "axios";
import React, { useState } from "react";
import { forgotPassword } from "../../services/api/auth";
import "./style.css"; // Assuming the styles are shared across components
import { BASE_URL } from "../../services/url";
interface ForgotPasswordProps {
  toggleForgotPassModal: () => void;
  switchToLoginModal: () => void;
}
const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  toggleForgotPassModal,
  switchToLoginModal,
}) => {
  // States for handling different steps
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [step, setStep] = useState<number>(1); // 1: Request Reset, 2: Reset Password

  // Handle the forgot password form submission (Step 1)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await forgotPassword(email);

      if (response.statusText == "OK") {
        setMessage("A reset token has been sent to your email.");
        setStep(2); // Move to the next step
      } else {
        setMessage("Failed to send reset token. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  // Handle the reset password form submission (Step 2)
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("userData");
      let resetToken = "";

      if (token) {
        resetToken = JSON.parse(token).refresh_token;
      }

      const response = await axios.post(
        `${BASE_URL}/auth/password-reset`,
        {
          password: newPassword,
          token: resetToken,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.statusText === "OK") {
        setMessage("Password has been reset successfully.");
        setStep(1); // Optionally, reset the form to start over or redirect the user
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {step === 1 ? (
            <>
              <h2>Forgot Password</h2>
              <p>Use your email to request a reset token</p>
            </>
          ) : (
            <>
              <h2>Reset Password</h2>
              <p>Enter your new password</p>
            </>
          )}
        </div>

        {step === 1 ? (
          // Forgot Password Form (Step 1)
          <form
            className="forgot-password-form"
            onSubmit={handleForgotPasswordSubmit}
          >
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              style={{ width: "100%" }}
            >
              Request Reset Token
            </button>
            {message && <p>{message}</p>}
          </form>
        ) : (
          // Reset Password Form (Step 2)
          <form
            className="reset-password-form"
            onSubmit={handleResetPasswordSubmit}
          >
            {/* <div className="input-group">
              <input
                type="text"
                placeholder="Reset Token"
                className="input-field"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
              />
            </div> */}
            <div className="input-group">
              <input
                type="password"
                placeholder="New Password"
                className="input-field"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                className="input-field"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              style={{ width: "100%" }}
            >
              Reset Password
            </button>
            {message && <p>{message}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
