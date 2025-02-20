import React, { useEffect, useState } from "react";
import "./StatusPage.css";

const StatusPage = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // ✅ ดึงข้อมูลการจองจาก localStorage หรือ API (สำหรับตอนนี้ใช้ mock data)
        const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [
            { id: "2176413876", time: "8:30-16:00", date: "13/2/2568", status: "รอติดตามเอกสาร" },
            { id: "2176413876", time: "9:00-11:00", date: "11/1/2568", status: "อนุมัติเอกสาร" },
            { id: "2176413876", time: "9:00-11:00", date: "10/1/2568", status: "กำลังใช้งาน" },
            { id: "2176413876", time: "9:00-11:00", date: "9/1/2568", status: "เสร็จสิ้น" },
            { id: "2176413876", time: "9:00-11:00", date: "8/1/2568", status: "ยกเลิก" },
        ];
        setBookings(storedBookings);
    }, []);

    // ✅ กำหนดสีตามสถานะ
    const getStatusClass = (status) => {
        switch (status) {
            case "รอติดตามเอกสาร": return "status-pending";
            case "อนุมัติเอกสาร": return "status-approved";
            case "กำลังใช้งาน": return "status-active";
            case "เสร็จสิ้น": return "status-completed";
            case "ยกเลิก": return "status-cancelled";
            default: return "";
        }
    };

    return (
        <div className="status-container">
            <h2>ติดตามสถานะ</h2>
            <table className="status-table">
                <thead>
                    <tr>
                        <th>เอกสารการจอง</th>
                        <th>วันเวลาที่ต้องการจอง</th>
                        <th>สถานะ</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <tr key={index}>
                            <td>
                                <a href={`/booking/${booking.id}`} className="booking-link">
                                    {booking.id}
                                </a>
                            </td>
                            <td>{booking.time} {booking.date}</td>
                            <td>
                                <span className={`status-badge ${getStatusClass(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td>
                                <button className="confirm-btn">ยืนยันอีกครั้ง →</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ✅ ปุ่มเปลี่ยนหน้า Pagination */}
            <div className="pagination">
                <button className="page-btn">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn">4</button>
                <button className="page-btn">5</button>
            </div>
        </div>
    );
};

export default StatusPage;
