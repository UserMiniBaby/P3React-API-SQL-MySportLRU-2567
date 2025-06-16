import React, { useContext, useEffect, useState } from "react";
import "./AdminUsers.css";
import DataTable from "react-data-table-component";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from 'sweetalert2'

function AdminUsers() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [usersData, setUsersData] = useState([]);

    const getUsersData = () => {
        Axios.get("http://localhost:5000/users/all", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setUsersData(resp.data.data)
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            })
    }

    const getRolesText = (roles) => {
        switch (roles) {
            case "Internal": return "ผู้ใช้ภายใน";
            case "External": return "ผู้ใช้ภายนอก";
            case "Division": return "แอดมินกองพัฒนานักศึกษา";
            case "Sports": return "แอดมินศูนย์กีฬา";
            default: return "";
        }
    };

    const setAdmin = (id) => {
        Axios.put(`http://localhost:5000/users/set-admin/${id}/${user.roles}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then((resp) => {
            if (resp.data.status === "ok") {
                Swal.fire({
                    title: 'ตั้งเป็นแอดมินสำเร็จ',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                })
                getUsersData();
            }
        })
        .catch((err) => {
            if (err.response.data.message) {
                alert(err.response.data.message)
            }
        });
    }

    const disableAdmin = (id) => {
        Axios.put(`http://localhost:5000/users/disable-admin/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then((resp) => {
            if (resp.data.status === "ok") {
                Swal.fire({
                    title: 'ยกเลิกแอดมินสำเร็จ',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                })
                getUsersData();
            }
        })
        .catch((err) => {
            if (err.response.data.message) {
                alert(err.response.data.message)
            }
        });
    }

    const columns = [
        {
            name: "ชื่อ",
            selector: (row) => row.first_name + " " + row.last_name,
        },
        {
            name: "เบอร์โทรศัพท์",
            selector: (row) => row.phonenumber,
        },
        {
            name: "E-mail",
            selector: (row) => row.email,
        },
        {
            name: "ตำแหน่ง",
            selector: (row) => getRolesText(row.roles),
        },
        {
            name: "จัดการ",
            selector: (row) => (
                <>
                    <div className="btn-group">
                        {row.roles === "Internal" && (
                            <button className="btn btn-warning" onClick={() => setAdmin(row.user_id)}>
                                ตั้งเป็นแอดมิน
                            </button>
                        )}
                        {row.roles === user.roles && (
                            <button className="btn btn-danger" onClick={() => disableAdmin(row.user_id)}>
                                ยกเลิกแอดมิน
                            </button>
                        )}
                    </div>
                </>
            ),
        },
    ];

    useEffect(() => {
        getUsersData()
    }, [])

    if (!user) return null;

    useEffect(() => {
        if (user.roles === "External" || user.roles === "Internal") {
            navigate("/");
        }
    }, [])

    return (
        <>
            <div className="d-flex justify-content-between">
                <h4 className="fw-bold">จัดการข้อมูลสมาชิก</h4>
            </div>
            <hr />
            <DataTable
                columns={columns}
                data={usersData}
                pagination
            />

        </>
    );
}

export default AdminUsers;
