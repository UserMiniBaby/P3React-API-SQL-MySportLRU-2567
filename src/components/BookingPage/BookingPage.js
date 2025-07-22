import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./BookingPage.css";
import Swal from 'sweetalert2'
import Axios from "axios";

const BookingPage = () => {
    const { itemName } = useParams();
    const decodedItemName = decodeURIComponent(itemName);
    const navigate = useNavigate();

    // อ่านและ decode ค่า type จาก query string
    const queryParams = new URLSearchParams(location.search);
    const rawType = queryParams.get("type") || "";
    const decodedType = decodeURIComponent(rawType);

    const [selectedDates, setSelectedDates] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [startTime, setStartTime] = useState("08:30");
    const [endTime, setEndTime] = useState("16:00");
    const [itemImage, setItemImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const thaiHolidays = [
        "2025-01-01", "2025-02-26", "2025-04-06", "2025-04-13",
        "2025-04-14", "2025-04-15", "2025-05-01", "2025-05-04",
        "2025-07-28", "2025-10-13", "2025-12-05", "2025-12-10", "2025-12-31"
    ];

    useEffect(() => {
        setItemImage(null);

        Axios.get("http://localhost:5000/sportequipment")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    const item = resp.data.data.find((equip) => equip.name === decodedItemName);
                    if (item && item.img) {
                        setItemImage(`http://localhost:5000/images/${item.img}`);
                    }
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("เกิดข้อผิดพลาดในการโหลดรูปภาพ:", err);
                setError("ไม่สามารถโหลดรูปได้");
                setLoading(false);
            });
            
        Axios.get("http://localhost:5000/stadium")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    const item = resp.data.data.find((equip) => equip.name === decodedItemName);
                    if (item && item.img) {
                        setItemImage(`http://localhost:5000/images/${item.img}`);
                    }
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("เกิดข้อผิดพลาดในการโหลดรูปภาพ:", err);
                setError("ไม่สามารถโหลดรูปได้");
                setLoading(false);
            });
    }, [decodedItemName]); // ✅ ใช้ useEffect ถูกต้อง

    // ✅ ป้องกันการเลือกวันซ้ำ หรือเกิน 5 วัน
    const handleDateSelect = (date) => {
        const dateString = date.toLocaleDateString("sv-SE", {
            timeZone: "Asia/Bangkok"
        });
        setSelectedDates((prevDates) => {
            if (prevDates.includes(dateString)) {
                return prevDates.filter((d) => d !== dateString);
            } else if (prevDates.length < 5) {
                return [...prevDates, dateString];
            }
            return prevDates;
        });
    };

    // ✅ กำหนดสีของวันที่ในปฏิทิน
    const tileClassName = ({ date, view }) => {
        if (view === "month") {
            const dateString = date.toLocaleDateString("sv-SE", {
                timeZone: "Asia/Bangkok"
            });
            const dayOfWeek = date.getDay();

            if (selectedDates.includes(dateString)) return "selected-day";
            if (thaiHolidays.includes(dateString)) return "holiday-day";
            if (dayOfWeek === 0 || dayOfWeek === 6) return "weekend-day";
            return "available-day";
        }
    };

    // ✅ ฟังก์ชันสร้างช่วงเวลา (เฉพาะนาทีที่เป็น 00 และ 30)
    const generateAllowedTimes = () => {
        const times = [];
        let hour = 8;
        let minute = 30;

        while (hour < 17) { // 16:30 เป็นเวลาสิ้นสุด ดังนั้นหยุดที่ 16:30
            let formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
            times.push(formattedTime);

            // เพิ่มทีละ 30 นาที
            if (minute === 0) {
                minute = 30;
            } else {
                minute = 0;
                hour++; // เปลี่ยนเป็นชั่วโมงถัดไป
            }
        }

        return times;
    };

    // ✅ สร้างตัวเลือกชั่วโมง (08 - 16)
    const allowedHours = Array.from({ length: 9 }, (_, i) => (8 + i).toString().padStart(2, "0"));

    // ✅ สร้างตัวเลือกนาที (00, 30)
    const allowedMinutes = ["00", "30"];

    const handleTimeChange = (type, newHour, newMinute) => {
        const newTime = `${newHour}:${newMinute}`;

        if (type === "start") {
            setStartTime(newTime);
            // ✅ ปรับ endTime อัตโนมัติถ้าเลือก startTime มากกว่าหรือเท่ากับ endTime
            if (newTime >= endTime) {
                setEndTime(`${newHour}:${allowedMinutes[allowedMinutes.indexOf(newMinute) + 1] || newMinute}`);
            }
        } else {
            if (newTime > startTime) {
                setEndTime(newTime);
            }
        }
    };

    // ✅ ดึงค่าชั่วโมงและนาทีปัจจุบันจาก state
    const [startHour, startMinute] = startTime.split(":");
    const [endHour, endMinute] = endTime.split(":");


    // ✅ ฟังก์ชันเพิ่มลงตะกร้า
    const addToCart = () => {
        if (selectedDates.length === 0) {
            Swal.fire({
                title: 'แจ้งเตือน',
                text: 'กรุณาเลือกวันที่ต้องการจองก่อน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return;
        }

        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        const newCartItem = { itemName: decodedItemName, type: decodedType, selectedDates, quantity, startTime, endTime };

        localStorage.setItem("cart", JSON.stringify([...cartItems, newCartItem]));
        navigate("/cart");
    };

    // ✅ ฟังก์ชันยืนยันการยืมอุปกรณ์และไปหน้า Checkout
    const confirmBorrow = () => {
        if (selectedDates.length === 0) {
            Swal.fire({
                title: 'แจ้งเตือน',
                text: 'กรุณาเลือกวันที่ต้องการจองก่อน',
                icon: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return;
        }

        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        const newCartItem = { itemName: decodedItemName, type: decodedType, selectedDates, quantity, startTime, endTime };

        localStorage.setItem("cart", JSON.stringify([...cartItems, newCartItem]));
        navigate("/checkout");
    };

    return (
        <div className="booking-container">
            <div className="booking-content">
                <div className="left-section">
                    <div className="item-image-placeholder">
                        {loading ? (
                            <p>กำลังโหลด...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : itemImage ? (
                            <img src={itemImage} alt={decodedItemName} className="item-image" />
                        ) : (
                            <p>ไม่มีรูปภาพ</p>
                        )}
                    </div>
                </div>



                {/* ✅ กลาง: ปฏิทินเลือกวัน */}
                <div className="center-section">
                    <h3>เลือกวันที่และเวลาที่ต้องการใช้บริการ</h3>
                    <h4>(สูงสุด 5 วัน)</h4>
                    <Calendar onChange={handleDateSelect} tileClassName={tileClassName} />

                    <div className="legend">
                        <div><span className="legend-box green"></span> วันจำนวนคิวว่างในการใช้บริการ</div>
                        <div><span className="legend-box red"></span> วันหยุดราชการ</div>
                        {/* <div><span className="legend-box gray"></span> วันหยุดราชการ</div> */}
                    </div>
                </div>

                {/* ✅ ขวา: เวลา, จำนวน, ปุ่ม */}
                <div className="right-section">
                    <div>
                        <label>เลือกเวลาที่เริ่ม:</label>
                        <div className="time-picker">
                            <select value={startHour} onChange={(e) => handleTimeChange("start", e.target.value, startMinute)}>
                                {allowedHours.map((hour) => (
                                    <option key={hour} value={hour}>{hour}</option>
                                ))}
                            </select>
                            :
                            <select value={startMinute} onChange={(e) => handleTimeChange("start", startHour, e.target.value)}>
                                {allowedMinutes.map((minute) => (
                                    <option key={minute} value={minute}>{minute}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>เลือกเวลาสิ้นสุด:</label>
                        <div className="time-picker">
                            <select value={endHour} onChange={(e) => handleTimeChange("end", e.target.value, endMinute)}>
                                {allowedHours.map((hour) => (
                                    <option key={hour} value={hour} disabled={hour < startHour}>{hour}</option>
                                ))}
                            </select>
                            :
                            <select value={endMinute} onChange={(e) => handleTimeChange("end", endHour, e.target.value)}>
                                {allowedMinutes.map((minute) => (
                                    <option key={minute} value={minute}>{minute}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <h3>{decodedItemName}</h3>
                    <div className="quantity-selector">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>

                    <button className="add-to-cart" onClick={addToCart}>ใส่ตะกร้า</button>
                    <button className="checkoutpage" onClick={confirmBorrow}>ยืนยันการจอง</button>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
