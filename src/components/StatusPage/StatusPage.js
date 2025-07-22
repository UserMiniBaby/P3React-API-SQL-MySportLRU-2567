import React, { useEffect, useState, useContext } from "react";
import "./StatusPage.css";
import Axios from "axios";
import Swal from 'sweetalert2';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from 'fontkit';
import { AuthContext } from "../../context/AuthContext";

const StatusPage = () => {
    const { user } = useContext(AuthContext);
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

    function wrapText(text, maxCharsPerLine) {
        const lines = [];
        let currentLine = "";

        text.split(" ").forEach(word => {
            // ถ้าคำเดียวยาวเกิน maxCharsPerLine → ตัดกลางคำเลย
            while (word.length > maxCharsPerLine) {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = "";
                }
                lines.push(word.slice(0, maxCharsPerLine));
                word = word.slice(maxCharsPerLine);
            }

            // กรณีเติมคำต่อท้ายบรรทัด
            if ((currentLine + (currentLine ? " " : "") + word).length <= maxCharsPerLine) {
                currentLine += (currentLine ? " " : "") + word;
            } else {
                if (currentLine) lines.push(currentLine);
                currentLine = word;
            }
        });

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }

    const openFiles = async (type, id, items, startDate, endDate, agency, objective) => {
        const existingPdfBytes = await fetch("http://localhost:5000/files/sport-form.pdf").then(res => res.arrayBuffer());

        // โหลดฟอนต์ TTF ภาษาไทย
        const fontBytes = await fetch('/fonts/Sarabun-Regular.ttf').then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // ขนาดหน้ากระดาษ
        const { width, height } = firstPage.getSize();

        pdfDoc.registerFontkit(fontkit);

        // ฝังฟอนต์
        const customFont = await pdfDoc.embedFont(fontBytes);

        // ชื่อ นามสกุล
        firstPage.drawText(`${user.first_name} ${user.last_name}`, {
            x: 165, // ระยะจากซ้าย
            y: height - 150, // ระยะจากล่าง (จากบน = height - y)
            size: 8,
            font: customFont,
            color: rgb(0, 0, 0),
        });

        // ตำแหน่ง
        firstPage.drawText(user.position || "", {
            x: 345, // ระยะจากซ้าย
            y: height - 150, // ระยะจากล่าง (จากบน = height - y)
            size: 8,
            font: customFont,
            color: rgb(0, 0, 0),
        });

        // หน่วยงาน
        firstPage.drawText(agency, {
            x: 125, // ระยะจากซ้าย
            y: height - 178, // ระยะจากล่าง (จากบน = height - y)
            size: 8,
            font: customFont,
            color: rgb(0, 0, 0),
        });

        const objectiveLines = wrapText(objective, 50); // หรือปรับตามความยาวข้อความที่เหมาะสม
        let objectiveY = height - 206;

        // วัตถุประสงค์
        objectiveLines.forEach((line, index) => {
            const lineX = index === 0 ? 252 : 95; // แถวแรกอยู่ที่ 252, ถัดไปอยู่ที่ 210

            firstPage.drawText(line, {
                x: lineX,
                y: objectiveY,
                size: 8,
                font: customFont,
                color: rgb(0, 0, 0),
            });

            objectiveY -= 18; // ระยะห่างระหว่างบรรทัด
        });


        firstPage.drawText(`${user.first_name} ${user.last_name}`, {
            x: 95, // ระยะจากซ้าย
            y: height - 534, // ระยะจากล่าง (จากบน = height - y)
            size: 8,
            font: customFont,
            color: rgb(0, 0, 0),
        });

        // เบอร์โทรศัพท์
        firstPage.drawText(user.phonenumber, {
            x: 375, // ระยะจากซ้าย
            y: height - 179, // ระยะจากล่าง (จากบน = height - y)
            size: 8,
            font: customFont,
            color: rgb(0, 0, 0),
        });

        // เลขที่ใบยืม
        firstPage.drawText(id.toString(), {
            x: 525, // ระยะจากซ้าย
            y: height - 35, // ระยะจากล่าง (จากบน = height - y)
            size: 8,
            font: customFont,
            color: rgb(0, 0, 0),
        });

        // แสดงรายการ items
        let startY = height - 305; // จุดเริ่มต้นของข้อมูล (แนวตั้ง)
        let startYQuantity = height - 305; // จุดเริ่มต้นของข้อมูล (แนวตั้ง)
        const lineHeight = 18; // ระยะห่างระหว่างบรรทัด

        items.forEach((item, index) => {
            firstPage.drawText(item.name, {
                x: 205,
                y: startY,
                size: 8,
                font: customFont,
                color: rgb(0, 0, 0),
            });

            startY -= lineHeight;
        });

        if (type === "sport") {
            items.forEach((item, index) => {
                firstPage.drawText(String(item.quantity), {
                    x: 350,
                    y: startYQuantity,
                    size: 8,
                    font: customFont,
                    color: rgb(0, 0, 0),
                });

                startYQuantity -= lineHeight;
            });

            // วันที่ยืม
            firstPage.drawText(`วันยืม/คืน ${formattedDateTime(startDate)} - ${formattedDateTime(endDate)}`, {
                x: 85, // ระยะจากซ้าย
                y: height - 480, // ระยะจากล่าง (จากบน = height - y)
                size: 8,
                font: customFont,
                color: rgb(0, 0, 0),
            });
        } else {
            // วันใช้งาน
            firstPage.drawText(`วันใช้งาน ${formattedDateTime(startDate)} - ${formattedDateTime(endDate)}`, {
                x: 85, // ระยะจากซ้าย
                y: height - 480, // ระยะจากล่าง (จากบน = height - y)
                size: 8,
                font: customFont,
                color: rgb(0, 0, 0),
            });
        }

        // สร้าง PDF ใหม่
        const pdfBytes = await pdfDoc.save();

        // ดาวน์โหลดไฟล์
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        window.open(url)

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
        console.log(user)
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
                                {booking.type === "stadium" ? (
                                    <>
                                        <a
                                            style={{ cursor: "pointer" }}
                                            className="fw-bold text-danger text-decoration-underline"
                                            onClick={() => window.open("http://localhost:5000/files/stadium.pdf")}
                                        >
                                            ตัวอย่าง
                                        </a>
                                        <a
                                            style={{ cursor: "pointer", marginLeft: "5px" }}
                                            className="fw-bold text-danger text-decoration-underline"
                                            onClick={() => openFiles(booking.type, booking.sdocument_id, booking.items, booking.start, booking.end, booking.agency, booking.objective)}
                                        >
                                            แบบฟอร์ม
                                        </a></>
                                ) : (
                                    <a
                                        style={{ cursor: "pointer" }}
                                        className="fw-bold text-danger text-decoration-underline"
                                        onClick={() => openFiles(booking.type, booking.document_id, booking.items, booking.start, booking.end, booking.agency, booking.objective)}
                                    >
                                        แบบฟอร์ม
                                    </a>
                                )}
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
