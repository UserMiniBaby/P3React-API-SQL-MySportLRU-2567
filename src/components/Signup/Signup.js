import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaAddressCard } from "react-icons/fa";
import "./Signup.css";
import Axios from "axios";
import Swal from 'sweetalert2'

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phonenumber: "",
    position: "",
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
        position: formData.position,
        password: formData.password,
        phonenumber: formData.phonenumber
      }).then((resp) => {
        if (resp.data.status === "ok") {
          Swal.fire({
            title: 'สมัครสมาชิกสำเร็จ',
            icon: 'success',
            confirmButtonText: 'ตกลง'
          })
          // หลังจากสมัครเสร็จให้เปลี่ยนไปหน้าล็อคอิน
          navigate("/login");
        }
      }).catch((err) => {
        if (err.response.data.message) {
          Swal.fire({
            title: err.response.data.message,
            icon: 'warning',
            confirmButtonText: 'ตกลง'
          })
        }
      })
    } else {
      Swal.fire({
        title: 'รหัสผ่านไม่ตรงกัน',
        icon: 'warning',
        confirmButtonText: 'ตกลง'
      })
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img className="bg-img" src="lru.png" alt="Logo" />
      </div>
      <div className="signup-right">
        <h2>สมัครสมาชิก</h2>
        <p>
          มีบัญชีอยู่แล้วใช่ไหม? <a href="#" onClick={() => navigate("/")}>Login</a>
        </p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="d-flex gap-2">
            <div className="input-group">
              <div>
                <label>ชื่อจริง</label>
                <div className="input-box">
                  <FaUser />
                  <input
                    type="text"
                    name="first_name"
                    placeholder="ชื่อจริง"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <div>
                <label>นามสกุล</label>
                <div className="input-box">
                  <FaUser />
                  <input
                    type="text"
                    name="last_name"
                    placeholder="นามสกุล"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <label>อีเมล</label>
            <div className="input-box">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                placeholder="อีเมล"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label>เบอร์โทรศัพท์</label>
            <div className="input-box">
              <FaPhone />
              <input
                type="tel"
                name="phonenumber"
                placeholder="เบอร์โทรศัพท์"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />
            </div>
          </div>
          <div>
            <label>ตำแหน่งงาน</label>
            <div className="input-box">
              <FaAddressCard />
              <input
                type="text"
                name="position"
                placeholder="ตำแหน่งงาน"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <div className="input-group">
              <div>
                <label>รหัสผ่าน</label>
                <div className="input-box">
                  <FaLock />
                  <input
                    type="password"
                    name="password"
                    placeholder="รหัสผ่าน"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="input-group">
              <div>
                <label>ยืนยันรหัสผ่าน</label>
                <div className="input-box">
                  <FaLock />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="ยืนยันรหัสผ่าน"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit">สร้างบัญชีของคุณ</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
