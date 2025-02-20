// DocumentDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./DocumentDetailsPage.css";

const DocumentDetailsPage = () => {
    const { itemName } = useParams(); // รับค่าจาก URL
    const [cartItem, setCartItem] = useState(null);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const itemDetails = storedCart.find(item => item.itemName === itemName); // ค้นหาข้อมูลที่ตรงกับ itemName
        setCartItem(itemDetails);
    }, [itemName]);

    return (
        <div className="document-details-container">
            <h3>รายละเอียดเอกสารการยืม</h3>
            {cartItem ? (
                <div className="details-box">
                    <p><strong>ชื่ออุปกรณ์:</strong> {cartItem.itemName}</p>
                    <p><strong>วันเวลา:</strong> {cartItem.selectedDates.join(", ")}</p>
                    <p><strong>เวลาเริ่ม:</strong> {cartItem.startTime}</p>
                    <p><strong>เวลาสิ้นสุด:</strong> {cartItem.endTime}</p>
                    <p><strong>จำนวน:</strong> {cartItem.quantity}</p>
                    <button onClick={() => alert("กำลังดำเนินการยืนยันการยืม")} className="confirm-btn">
                        ยืนยันการยืม
                    </button>
                </div>
            ) : (
                <p>ไม่พบข้อมูลการยืม</p>
            )}
        </div>
    );
};

export default DocumentDetailsPage;
