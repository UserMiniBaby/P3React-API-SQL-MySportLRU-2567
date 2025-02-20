import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import "./Signup.css";
import Axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password === formData.confirmPassword) {
      Axios.post("http://localhost:5000/auth/register", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phonenumber: formData.phonenumber
      }).then((resp) => {
        if (resp.data.status === "ok") {
          alert("สมัครสมาชิกสำเร็จ")
          // หลังจากสมัครเสร็จให้เปลี่ยนไปหน้าล็อคอิน
          navigate("/login");
        }
      }).catch((err) => {
        if (err.response.data.message) {
          alert(err.response.data.message)
        }
      })
    } else {
      alert("รหัสผ่านไม่ตรงกัน")
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img className="bg-img" src="lru.png" alt="Logo" />
      </div>
      <div className="signup-right">
        <h2>Signup</h2>
        <p>
          Already have an account? <a href="#" onClick={() => navigate("/login")}>Login</a>
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="d-flex gap-2">
            <div className="input-group">
              <div>
                <label>First Name</label>
                <div className="input-box">
                  <FaUser />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <div>
                <label>Last Name</label>
                <div className="input-box">
                  <FaUser />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
              <label>Email</label>
              <div className="input-box">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          <div>
            <label>Phone Number</label>
            <div className="input-box">
              <FaPhone />
              <input
                type="tel"
                name="phonenumber"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2">
              <div className="input-group">
                <div>
                  <label>Password</label>
                  <div className="input-box">
                    <FaLock />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="input-group">
                <div>
                  <label>Confirm Password</label>
                  <div className="input-box">
                    <FaLock />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
