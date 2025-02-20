import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);

    const onLogout = () => {
        logout();
        navigate("/login");
    }

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="menu">
                {user.roles === "Internal" && (
                    <span className="nav-link" onClick={() => navigate("/")}>
                        อุปกรณ์กีฬา
                    </span>
                )}
                <Link to="/sports">พื้นที่กีฬา</Link>
                <Link to="/status">ติดตามสถานะ</Link>
            </div>

            <div className="icons">
                {/* ✅ กดไอคอนตะกร้าให้ไปหน้าตะกร้า */}
                <FaShoppingCart className="nav-icon" onClick={() => navigate("/cart")} style={{ cursor: "pointer" }} />

                
                <span className="user-name">{user?.first_name}</span>
                <Link to="/account-settings">
                    <FaUser className="nav-icon profile-icon" />
                </Link>
                <button className="logout-button" onClick={onLogout}>ออกจากระบบ</button>
                    
            </div>
        </nav>
    );
};

export default Navbar;
