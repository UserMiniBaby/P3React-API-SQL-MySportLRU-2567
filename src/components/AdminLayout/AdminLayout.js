import React, { useContext, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaWater, FaAlignLeft, FaSignOutAlt, FaWrench } from "react-icons/fa"; // เพิ่มไอคอน
import "./AdminLayout.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Axios from "axios"
import { IoIosBasketball } from "react-icons/io";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { IoIosJournal } from "react-icons/io";
function AdminLayout() {

    const navigate = useNavigate();
    const { loggedIn, saveUser, logout, user } = useContext(AuthContext);

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login");
        } else {
            Axios.get("http://localhost:5000/users", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((resp) => {
                if (resp.data.status === "ok") {
                    saveUser(resp.data.data);
                }
            }).catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            })
        }
    }, [])

    const onLogout = () => {
        logout();
        navigate("/login");
    }

    if (!user) return null;

    return (
        <>
            <section className="layout-container d-flex flex-column">
                <header className="layout-header">
                    <div className="d-flex align-items-center">
                        <Link to="/">
                            <img
                                src="/LRuQ.png"
                                alt="logo-header"
                                style={{ height: "150px" }}
                            />
                        </Link>
                        <div className="ms-3">
                            <h5 className="fw-bold">Admin</h5>
                            <h3 className="fw-bold">{user.roles === "Sports" ? "ศูนย์กีฬา" : "กองพัฒนานักศึกษา"}</h3>
                        </div>
                    </div>
                </header>
                <section className="d-flex flex-fill">
                    <aside className="layout-sidebar d-flex flex-column justify-content-between">
                        <div>
                        <div className="mb-2 fw-bold">{user.first_name + " " + user.last_name}</div>                            <Link
                                to="/dashboard"
                                type="button"
                                className="btn btn-outline-primary w-100 mb-2"
                            >
                                <FaWater className="me-2" />
                                Dashboard
                            </Link>
                            {user.roles === "Sports" && (
                                <>
                                    <Link
                                        to="/dashboard/stadium"
                                        type="button"
                                        className="btn btn-outline-primary w-100 mb-2"
                                    >
                                        <FaUser className="me-2" />
                                        จัดการพื้นที่กีฬา
                                    </Link>
                                    <Link
                                        to="/dashboard/stadiumreserve"
                                        type="button"
                                        className="btn btn-outline-primary w-100 mb-2"
                                    >
                                        <IoIosJournal className="me-2" />
                                        จัดการข้อมูลการจอง
                                    </Link>
                                </>
                            )}
                            {user.roles === "Division" && (
                                <>
                                    <Link
                                        to="/dashboard/sportequipment"
                                        type="button"
                                        className="btn btn-outline-primary w-100 mb-2"
                                    >
                                        <FaUser className="me-2" />
                                        จัดการอุปกรณ์กีฬา
                                    </Link>
                                    <Link
                                        to="/dashboard/sportrecive"
                                        type="button"
                                        className="btn btn-outline-primary w-100 mb-2"
                                    >
                                        <IoIosBasketball className="me-2" />
                                        รายงานรับอุปกรณ์
                                    </Link>
                                    <Link
                                        to="/dashboard/sportreduce"
                                        type="button"
                                        className="btn btn-outline-primary w-100 mb-2"
                                    >
                                        <HiArchiveBoxXMark className="me-2" />
                                        รายงานจำหน่ายอุปกรณ์
                                    </Link>
                                    <Link
                                        to="/dashboard/sportborrow"
                                        type="button"
                                        className="btn btn-outline-primary w-100 mb-2"
                                    >
                                        <FaAlignLeft className="me-2" />
                                        จัดการข้อมูลยืมคืน
                                    </Link>
                                </>
                            )}
                            <Link
                                to="/dashboard/users"
                                type="button"
                                className="btn btn-outline-primary w-100 mb-2"
                            >
                                <FaWrench className="me-2" />
                                จัดการข้อมูลผู้ใช้งาน
                            </Link>
                        </div>

                        <button
                            onClick={onLogout}
                            type="button"
                            className="btn btn-danger w-100 mb-2"
                        >
                            <FaSignOutAlt className="me-2" />
                            ออกจากระบบ
                        </button>
                    </aside>

                    <main className="layout-main flex-fill">
                        <div className="w-100 h-100 bg-white p-3 rounded-4">
                            <Outlet />
                        </div>
                    </main>
                </section>
            </section>
        </>
    );
}

export default AdminLayout;
