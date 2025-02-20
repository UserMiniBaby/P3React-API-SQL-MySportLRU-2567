import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";
import Axios from "axios";
import Swal from 'sweetalert2'

const Login = () => {
  const navigate = useNavigate();
  const { saveUser, saveToken } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ✅ ฟังก์ชันสำหรับอัปเดตค่า formData
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    Axios.post("http://localhost:5000/auth/login", {
      email: formData.email,
      password: formData.password
    }).then((resp) => {
      if (resp.data.status === "ok") {
        Swal.fire({
          title: 'แจ้งเตือน',
          text: 'เข้าสู่ระบบสำเร็จ',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        })
        saveToken(resp.data.token);
        saveUser(resp.data.data);

        let roles = resp.data.data.roles;

        if (roles === "Internal" || roles === "External") {
          navigate("/sports");
        }

        if (roles === "Sports" || roles === "Division") {
          navigate("/dashboard");
        }
      }
    }).catch((err) => {
      if (err.response.data.message) {
        Swal.fire({
          title: 'แจ้งเตือน',
          text: err.response.data.message,
          icon: 'error',
          confirmButtonText: 'ตกลง'
        })
      }
    })
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img className="bg-img" src="lru.png" alt="Logo" />
      </div>
      <div className="login-right">
        <h2>Login</h2>
        <p>
          Do not have an account?{" "}
          <a href="#" onClick={() => navigate("/signup")}>
            create a new one.
          </a>
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Enter Your Email</label>
          <div className="input-box">
            <FaEnvelope />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange} // ✅ ใช้ handleChange
              required
            />
          </div>

          <label>Enter Your Password</label>
          <div className="input-box">
            <FaLock />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange} // ✅ ใช้ handleChange
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="forgot-password">
          <a href="#">Forgot Your Password</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
