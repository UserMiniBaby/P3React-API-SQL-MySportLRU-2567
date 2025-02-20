import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Axios from "axios"; // ✅ ใช้ดึงข้อมูลจาก API
import Swal from "sweetalert2";
import "./CheckoutPage.css";

const ConfirmBorrowPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // ✅ สร้าง state สำหรับเก็บข้อมูลผู้ใช้ที่ดึงจาก API
    const [userData, setUserData] = useState({
        first_name: "",
        phonenumber: "",
        email: ""
    });

    const [cart, setCart] = useState([]);

    // ✅ ดึงข้อมูลผู้ใช้จาก API เมื่อหน้าโหลด
    useEffect(() => {
        Axios.get("http://localhost:5000/users", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setUserData(resp.data.data); // ✅ อัปเดตข้อมูลผู้ใช้
                }
            })
            .catch((err) => {
                console.error("Error fetching user data:", err);
            });
    }, []);

    // ✅ โหลดข้อมูลตะกร้า
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // ✅ ฟังก์ชันยืนยันการยืม
    const handleConfirm = () => {
        Swal.fire({
            title: "แจ้งเตือน",
            text: "ส่งคำขอยืมอุปกรณ์เรียบร้อยแล้ว!",
            icon: "success",
            confirmButtonText: "ตกลง"
        });
        localStorage.removeItem("cart"); // ✅ ล้างตะกร้าหลังยืนยัน
        navigate("/status"); // ✅ ไปยังหน้าติดตามสถานะ
    };

    return (
        <div className="confirm-container">
            <div className="confirm-content">
                {/* ✅ ส่วนรายละเอียดบัญชี */}
                <div className="left-section">
                    <h3 className="section-title">รายละเอียดส่วนตัว</h3>
                    <div className="info-box">
                        <p><strong>ชื่อ:</strong> {userData.first_name && userData.last_name
                            ? `${userData.first_name} ${userData.last_name}`
                            : "ไม่พบข้อมูล"}
                        </p>

                        <p><strong>เบอร์โทรศัพท์:</strong> {userData.phonenumber || "ไม่พบข้อมูล"}</p>
                        <p><strong>Email:</strong> {userData.email || "ไม่พบข้อมูล"}</p>
                    </div>
                </div>

                {/* ✅ ส่วนรายการที่เลือก */}
                <div className="right-section">
                    <h3 className="section-title">รายละเอียด</h3>
                    {cart.length === 0 ? (
                        <p className="empty-cart">ไม่มีอุปกรณ์ในตะกร้า</p>
                    ) : (
                        <table className="order-table">
                            <thead>
                                <tr>
                                    <th>ชื่ออุปกรณ์</th>
                                    <th>เวลาที่จอง</th>
                                    <th>วันที่จอง</th>
                                    <th>จำนวน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.itemName}</td>
                                        <td>{item.startTime} - {item.endTime}</td>
                                        <td>{item.selectedDates.join(", ")}</td>
                                        <td>{item.quantity}</td> {/* ✅ แสดงจำนวน */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <button className="confirm-button" onClick={handleConfirm}>ยืนยันการยืม</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBorrowPage;
