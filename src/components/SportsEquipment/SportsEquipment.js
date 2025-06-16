import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SportsEquipment.css";
import { AuthContext } from "../../context/AuthContext";
import Axios from "axios";

const SportsEquipment = () => {
    const { user, logout } = useContext(AuthContext);
    const [equipmentData, setEquipmentData] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    useEffect(() => {
        Axios.get("http://localhost:5000/sportequipment")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setEquipmentData(resp.data.data);
                }
            })
            .catch((err) => {
                alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
            });
    }, []);

    // ✅ ตรวจสอบ user หลังจาก Hooks ถูกเรียกใช้แล้ว
    if (!user) return null;

    if (user.roles === "External") {
        navigate("/sports");
    } 
    if (user.roles === "Division" || user.roles === "Sports") {
        navigate("/dashboard");
    }

    const filteredItems = equipmentData.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) && item.status
    );

    return (
        <div className="sports-container">
            <h1>อุปกรณ์กีฬา</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="ค้นหาอุปกรณ์..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <p>Showing {filteredItems.length} of {equipmentData.length} item(s)</p>

            <div className="sports-grid">
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="sport-card"
                        onClick={() => navigate(`/booking/${encodeURIComponent(item.name)}?type=${item.type}`)}
                    >
                        <img
                            src={`http://localhost:5000/images/${item.img}`}
                            alt={item.name}
                            className="image-placeholder"
                        />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SportsEquipment;
