import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyOTPRoute } from "../../api/apiRoutes";
import styles from './Otp.module.css';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const email = sessionStorage.getItem('email');
  const [otp, setOtp] = useState("");

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP.", toastOptions);
      return;
    }

    const { data } = await axios.post(verifyOTPRoute, {
      email,
      OTP: otp,
    });

    if (data.status === false) {
      toast.error(data.message, toastOptions);
    } else {
      toast.success("User verified successfully!", toastOptions);
      navigate("/login");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.brand}>
            <img src={Logo} alt="logo" />
            <h1>Verify OTP</h1>
          </div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
