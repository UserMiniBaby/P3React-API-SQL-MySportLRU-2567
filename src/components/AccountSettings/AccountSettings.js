import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./AccountSettings.css";
import { AuthContext } from "../../context/AuthContext";
import Axios from "axios";
import Swal from 'sweetalert2'

const AccountSettings = () => {
    const { user, saveUser } = useContext(AuthContext);

    const [first_name, setFirst_Name] = useState("");
    const [last_name, setLast_Name] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [conPassword, setConPassword] = useState("");

    const getProfile = () => {
        Axios.get("http://localhost:5000/users", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token") 
            }
        }).then((resp) => {
            if (resp.data.status === "ok") {
                let userData = resp.data.data;

                setFirst_Name(userData.first_name);
                setLast_Name(userData.last_name);
                setPhoneNumber(userData.phonenumber);

                saveUser({...user, phonenumber: phoneNumber, first_name, last_name});
            }
        }).catch((err) => {
            if (err.response.data.message) {
                alert(err.response.data.message)
            }
        })
    }

    useEffect(() => {
        getProfile()
    }, [])

    // 📌 ฟังก์ชันอัปเดตข้อมูลไปยัง MySQL
    const handleSaveChanges = () => {
        if (first_name !== "" && last_name !== "" && phoneNumber !== "") {
            if (password !== "") {
                if (password !== conPassword) {
                    Swal.fire({
                        title: 'แจ้งเตือน',
                        text: 'รหัสผ่านไม่ตรงกัน',
                        icon: 'warning',
                        confirmButtonText: 'ตกลง'
                    })
                    return;
                }
            }

            axios.put("http://localhost:5000/users/update", {
                first_name: first_name,
                last_name: last_name,
                phonenumber: phoneNumber,
                password: password
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'แจ้งเตือน',
                        text: 'แก้ไขข้อมูลสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getProfile();
                  }
            })
            .catch(err => {
                if (err.response.data.message) {
                    Swal.fire({
                        title: 'แจ้งเตือน',
                        text: 'ไม่สามารถแก้ไขข้อมูลได้',
                        icon: 'error',
                        confirmButtonText: 'ตกลง'
                    })
                    console.log(err.response.data.message)
                }
            });

        } else {
            Swal.fire({
                title: 'แจ้งเตือน',
                text: 'กรอกข้อมูลให้ครบถ้วน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            })
        }
    };

    return (
        <div className="account-settings-container">
            <h2>Account Settings</h2>
            <div className="form-section">
                <h3>ข้อมูลโปรไฟล์</h3>
                <label>First Name</label>
                <input 
                    type="text" 
                    value={first_name} 
                    onChange={(e) => setFirst_Name(e.target.value)} 
                />
                <label>Last Name</label>
                <input 
                    type="text" 
                    value={last_name} 
                    onChange={(e) => setLast_Name(e.target.value)} 
                />
                <label>Phone Number</label>
                <input 
                    type="text" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                />
                <label>Password</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <label>Confirm Password</label>
                <input 
                    type="password" 
                    value={conPassword} 
                    onChange={(e) => setConPassword(e.target.value)} 
                />
            </div>

            <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>
        </div>
    );
};

export default AccountSettings;
