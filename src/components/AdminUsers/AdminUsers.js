import React, { useContext, useEffect, useState } from "react";
import "./AdminUsers.css";
import DataTable from "react-data-table-component";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from 'sweetalert2'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function AdminUsers() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [usersData, setUsersData] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editTel, setEditTel] = useState("");
    const [editPass, setEditPass] = useState("");
    const [editConPass, setEditConPass] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const handleCloseEditModal = () => {
        setShowEdit(false)
        setEditId(null);
    };

    const handleShowEditModal = (data) => {
        setEditId(data.user_id);
        setEditFirstName(data.first_name);
        setEditLastName(data.last_name);
        setEditTel(data.phonenumber)
        setShowEdit(true)
    };

    const getUsersData = () => {
        Axios.get("http://localhost:5000/users/all", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (user.roles === "Division") {
                    const filteredData = resp.data.data.filter(
                        (item) => item.roles !== "External" && item.roles !== "Sports"
                    );
                    setUsersData(filteredData);
                    setFilteredData(filteredData);
                } else {
                    const filteredData = resp.data.data.filter(
                        (item) => item.roles !== "Division"
                    );
                    setUsersData(filteredData);
                    setFilteredData(filteredData);
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

    const submitEdit = () => {
        if (editId !== "" && editFirstName !== "" && editLastName !== "" && editTel !== "") {
            if (editPass != "" && editPass != editConPass) {
                Swal.fire({
                    title: "แจ้งเตือน",
                    text: "รหัสผ่านไม่ตรงกัน",
                    icon: "error",
                    confirmButtonText: "ตกลง"
                });
                return;
            }
            Axios.put(`http://localhost:5000/users/admin/update`, {
                id: editId,
                first_name: editFirstName,
                last_name: editLastName,
                phonenumber: editTel,
                password: editPass,
            }, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            })
                .then((resp) => {
                    if (resp.data.status === "ok") {
                        Swal.fire({
                            title: 'แจ้งเตือน',
                            text: 'แก้ไขข้อมูลสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        })

                        getUsersData()
                        handleCloseEditModal()
                        setEditFirstName("");
                        setEditLastName("");
                        setEditTel("");
                        setEditPass("");
                    }
                })
                .catch((err) => {
                    if (err.response.data.message) {
                        Swal.fire({
                            title: "แจ้งเตือน",
                            text: err.response.data.message,
                            icon: "error",
                            confirmButtonText: "ตกลง"
                        });
                    }

                    console.error("Error saving data:", err);
                });
        } else {
            alert("กรอกข้อมูลให้ครบถ้วน")
        }
    };

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
                        <button className="btn btn-primary" onClick={() => handleShowEditModal(row)}>
                            แก้ไข
                        </button>
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

    // ฟังก์ชันกรองข้อมูลตามคำค้น
    useEffect(() => {
        const filtered = usersData.filter((user) =>
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phonenumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            getRolesText(user.roles).toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, usersData]);

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
                <div>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="ค้นหา"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "300px" }}
                    />
                </div>
            </div>
            <hr />
            <DataTable
                columns={columns}
                data={filteredData}
                pagination
            />

            {/* Modal แก้ไข */}
            <Modal show={showEdit} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขข้อมูล</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="firstname">ชื่อ</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                value={editFirstName}
                                onChange={(e) =>
                                    setEditFirstName(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="lastname">นามสกุล</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastname"
                                value={editLastName}
                                onChange={(e) =>
                                    setEditLastName(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="tel">เบอร์โทรศัพท์</label>
                            <input
                                type="text"
                                className="form-control"
                                id="tel"
                                value={editTel}
                                onChange={(e) =>
                                    setEditTel(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="pass">รหัสผ่าน</label>
                            <input
                                type="password"
                                className="form-control"
                                id="pass"
                                value={editPass}
                                onChange={(e) =>
                                    setEditPass(e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col">

                        </div>
                        <div className="col">
                            <label htmlFor="conpass">ยืนยันรหัสผ่าน</label>
                            <input
                                type="password"
                                className="form-control"
                                id="conpass"
                                value={editConPass}
                                onChange={(e) =>
                                    setEditConPass(e.target.value)
                                }
                            />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        ปิด
                    </Button>
                    <Button variant="primary" onClick={submitEdit}>
                        ยืนยัน
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AdminUsers;
