import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css"; // Assuming the styles are shared across components

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>(); // Extract token from URL
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate(); // Replaces useHistory

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword, token }),
      });

      if (response.ok) {
        setMessage("Password has been reset successfully.");
        navigate("/login"); // Navigate to the login page after success
      } else {
        setMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            required
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
    </div>
  );
};

export default ResetPassword;
