import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./CartPage.css";

const CartPage = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [equipmentData, setEquipmentData] = useState([]); // ✅ เก็บข้อมูลอุปกรณ์จาก API

    useEffect(() => {
        // ✅ ดึงรายการอุปกรณ์ทั้งหมดจาก API
        Axios.get("http://localhost:5000/sportequipment")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setEquipmentData(resp.data.data);
                }
            })
            .catch((err) => {
                console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลอุปกรณ์:", err);
            });

        // ✅ ดึงข้อมูลจาก localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    // ✅ ฟังก์ชันอัปเดต `localStorage`
    const updateCartStorage = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // ✅ ฟังก์ชันเพิ่มจำนวนอุปกรณ์
    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity += 1;
        updateCartStorage(updatedCart);
    };

    // ✅ ฟังก์ชันลดจำนวนอุปกรณ์ (ขั้นต่ำ 1)
    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity -= 1;
            updateCartStorage(updatedCart);
        }
    };

    // ✅ ฟังก์ชันลบรายการออกจากตะกร้า
    const removeItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        updateCartStorage(updatedCart);
    };

    return (
        <div className="cart-container">
            <h2>รายการอุปกรณ์</h2>

            {cart.length === 0 ? (
                <p>ไม่มีสินค้าในตะกร้า</p>
            ) : (
                <table className="cart-table">
                    <thead>
                        <tr>
                            <th></th> {/* ปุ่มลบ */}
                            <th>รายการอุปกรณ์</th>
                            <th>เวลา</th>
                            <th>วันที่</th>
                            <th>จำนวน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item, index) => {
                            // ✅ ค้นหารูปของ item จาก API
                            const foundItem = equipmentData.find((equip) => equip.name === item.itemName);
                            const imageUrl = foundItem ? `http://localhost:5000/images/${foundItem.img}` : "https://via.placeholder.com/40";

                            return (
                                <tr key={index}>
                                    <td>
                                        <button className="remove-btn" onClick={() => removeItem(index)}>×</button>
                                    </td>
                                    <td className="cart-item">
                                        <img src={imageUrl} alt={item.itemName} className="cart-image" />
                                        {item.itemName}
                                    </td>
                                    <td>{item.startTime} - {item.endTime}</td>
                                    <td>{item.selectedDates.join(", ")}</td>
                                    <td className="quantity-container">
                                        <button className="quantity-btn" onClick={() => decreaseQuantity(index)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className="quantity-btn" onClick={() => increaseQuantity(index)}>+</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            {cart.length > 0 && (
                <button onClick={() => navigate("/checkoutpage")} className="checkout-button">
                    ดำเนินการจองสนาม
                </button>
            )}
        </div>
    );
};

export default CartPage;
