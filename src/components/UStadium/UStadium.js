import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../SportsEquipment/SportsEquipment.css";
import { AuthContext } from "../../context/AuthContext";
import Axios from "axios";

const UStadium = () => {
    const { user, logout } = useContext(AuthContext);
    const [StadiumData, setStadiumData] = useState([]);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    useEffect(() => {
        Axios.get("http://localhost:5000/stadium")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setStadiumData(resp.data.data);
                }
            })
            .catch((err) => {
                alert(err.response?.data?.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
            });
    }, []);

    // ✅ ตรวจสอบ user หลังจาก Hooks ถูกเรียกใช้แล้ว
    if (!user) return null;

    if (user.roles === "Division" || user.roles === "Sports") {
        navigate("/dashboard");
    }

    const filteredItems = StadiumData.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="sports-container">
            <h1>พื้นที่กีฬา</h1>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="พื้นที่กีฬา..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <p>Showing {filteredItems.length} of {StadiumData.length} item(s)</p>

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

export default UStadium;



