import { useState } from "react";

const AadharVerification = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    aadharNumber: "",
    name: "",
    phoneNumber: "",
    otp: "",
    panNumber: "",
  });
  const [displayedOTP, setDisplayedOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/verify/aadhar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aadharNumber: formData.aadharNumber,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate OTP");

      setDisplayedOTP(data.otp); // Store the OTP to display
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/verify/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          otp: formData.otp,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "OTP verification failed");

      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePANSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate PAN submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess(true);
      setTimeout(() => window.location.reload(), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Aadhar Verification System</h1>

      {success ? (
        <div className="success">
          <p>✅ Verification Successful!</p>
          <p>Page will refresh...</p>
        </div>
      ) : (
        <>
          {step === 1 && (
            <form onSubmit={handleStep1Submit}>
              <h2>Step 1: Enter Aadhar Details</h2>
              <div className="form-group">
                <label>Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  maxLength="12"
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  maxLength="10"
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? "Generating OTP..." : "Generate OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="otp-step">
              <form onSubmit={handleOTPSubmit}>
                <h2>Step 2: Verify OTP</h2>

                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    readOnly
                    className="readonly-input"
                  />
                  {/* Display OTP directly on the form */}
                  <div className="otp-display">
                    <p>
                      Generated OTP: <strong>{displayedOTP}</strong>
                    </p>
                    <small>(This OTP is for testing purposes)</small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength="4"
                    required
                  />
                </div>
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handlePANSubmit}>
              <h2>Step 3: Enter PAN Details</h2>
              <div className="form-group">
                <label>PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  maxLength="10"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default AadharVerification;
