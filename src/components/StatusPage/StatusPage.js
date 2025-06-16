import React, { useEffect, useState } from "react";
import "./StatusPage.css";
import Axios from "axios";
import Swal from 'sweetalert2'

const StatusPage = () => {
    const [bookings, setBookings] = useState([]);

    const getData = () => {
        Axios.get("http://localhost:5000/status", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((resp) => {
            if (resp.data.status === "ok") {
                setBookings(resp.data.data);
                console.log(resp.data.data);
            }
        })
            .catch((err) => {
                console.error("Error fetching status data:", err);
            });
    }

    useEffect(() => {
        // ✅ ดึงข้อมูลการจองจาก localStorage หรือ API (สำหรับตอนนี้ใช้ mock data)
        // const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [
        //     { id: "2176413876", time: "8:30-16:00", date: "13/2/2568", status: "รอติดตามเอกสาร" },
        //     { id: "2176413876", time: "9:00-11:00", date: "11/1/2568", status: "อนุมัติเอกสาร" },
        //     { id: "2176413876", time: "9:00-11:00", date: "10/1/2568", status: "กำลังใช้งาน" },
        //     { id: "2176413876", time: "9:00-11:00", date: "9/1/2568", status: "เสร็จสิ้น" },
        //     { id: "2176413876", time: "9:00-11:00", date: "8/1/2568", status: "ยกเลิก" },
        // ];
        // setBookings(storedBookings);
        getData();
    }, []);

    // ✅ กำหนดสีตามสถานะ
    const getStatusClass = (status) => {
        switch (status) {
            case "wait": return "status-pending";
            case "approve": return "status-approved";
            case "ongoing": return "status-active";
            case "success": return "status-completed";
            case "cancel": return "status-cancelled";
            default: return "";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "wait": return "รอติดตามเอกสาร";
            case "approve": return "อนุมัติเอกสาร";
            case "ongoing": return "กำลังใช้งาน";
            case "success": return "เสร็จสิ้น";
            case "cancel": return "ยกเลิก";
            default: return "";
        }
    };

    const formattedDateTime = (data) => {
        const formated = new Date(data);
        return `${formated.toLocaleDateString()} - ${formated.toLocaleTimeString()}`;
    }

    const onCancel = (data) => {
        if (data.sdocument_id) {
            Axios.put(`http://localhost:5000/status/stadium/${data.sdocument_id}`, {}, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
                .then((resp) => {
                    if (resp.data.status === "ok") {
                        Swal.fire({
                            title: 'ยกเลิกสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        })
                        getData();
                    }
                })
                .catch((err) => {
                    if (err.response.data.message) {
                        alert(err.response.data.message)
                    }
                });
        } else {
            Axios.put(`http://localhost:5000/status/sport/${data.document_id}`, {}, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
                .then((resp) => {
                    if (resp.data.status === "ok") {
                        Swal.fire({
                            title: 'ยกเลิกสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        })
                        getData();
                    }
                })
                .catch((err) => {
                    if (err.response.data.message) {
                        alert(err.response.data.message)
                    }
                });
        }
    }

    return (
        <div className="status-container">
            <h2>ติดตามสถานะ</h2>
            <table className="status-table">
                <thead>
                    <tr>
                        <th>เอกสาร</th>
                        <th>วันเวลาที่ต้องการใช้บริการ</th>
                        <th>รอติดตามเอกสาร</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking, index) => (
                        <tr key={index}>
                            <td>
                                <a
                                    target="_blank"
                                    href={`http://localhost:5000/files/${booking.type === "stadium" ? "stadium.pdf" : "sport-form.pdf"}`}
                                    className="fw-bold text-danger text-decoration-underline"
                                >
                                    {booking.type === "stadium" ? "ตัวอย่าง" : "แบบฟอร์ม"}
                                </a>

                            </td>
                            <td>{formattedDateTime(booking.start)} - {formattedDateTime(booking.end)}</td>
                            <td>
                                <span className={`status-badge ${getStatusClass(booking.status)}`}>
                                    {getStatusText(booking.status)}
                                </span>
                            </td>
                            <td>
                                <button className="confirm-btn" onClick={() => onCancel(booking)}>ยกเลิก</button>
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
