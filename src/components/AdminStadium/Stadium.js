import React, { useContext, useEffect, useState } from "react";
import "./Stadium.css";
import DataTable from "react-data-table-component";
import { FaRegTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Axios from "axios";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Stadium() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [name, setName] = useState("");
    const [selectedImage, setSelectedImage] = useState(null)
    const [stadiumData, setStadiumData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showEditImage, setShowEditImage] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const handleCloseAddModal = () => setShowAdd(false);
    const handleShowAddModal = () => setShowAdd(true);

    const handleCloseEditModal = () => {
        setShowEdit(false)
        setEditId(null);
        setName("");
        setSelectedImage(null);
    };

    const handleShowEditModal = (id) => {
        setEditId(id);

        Axios.get(`http://localhost:5000/stadium/${id}`)
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setName(resp.data.data.name);
                    setShowEditImage(resp.data.data.img);
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            })

        setShowEdit(true)
    };

    const getStadiumData = () => {
        Axios.get("http://localhost:5000/stadium")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setStadiumData(resp.data.data)
                    setFilteredData(resp.data.data);
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            })
    }

    const submitEdit = () => {
        if (name !== "") {
            const formData = new FormData();
            if (selectedImage) {
                formData.append("img", selectedImage);
            }
            formData.append("name", name);

            Axios.put(`http://localhost:5000/stadium/edit/${editId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            })
                .then((resp) => {
                    if (resp.data.status === "ok") {
                        Swal.fire({
                            title: 'แจ้งเตือน',
                            text: 'แก้ไขสำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        })
                        handleCloseEditModal()
                        setSelectedImage(null);
                        setName("");
                        getStadiumData();
                    }
                })
                .catch((err) => {
                    if (err.response.data.message) {
                        alert(err.response.data.message)
                    }
                });
        } else {
            alert("กรอกข้อมูลให้ครบถ้วน")
        }
    };

    const submit = () => {
        if (selectedImage && name !== "") {
            const formData = new FormData();
            formData.append("img", selectedImage);
            formData.append("name", name);

            Axios.post("http://localhost:5000/stadium/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            })
                .then((resp) => {
                    if (resp.data.status === "ok") {
                        handleCloseAddModal()
                        setSelectedImage(null);
                        setName("");
                        getStadiumData();
                    }
                })
                .catch((err) => {
                    if (err.response.data.message) {
                        alert(err.response.data.message)
                    }
                });
        } else {
            alert("กรอกข้อมูลให้ครบถ้วน")
        }
    };

    const enableStadium = (id) => {
        Axios.put(`http://localhost:5000/stadium/enable/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'เปิดใช้งานพื้นที่กีฬาสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getStadiumData();
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            });
    }

    const disableStadium = (id) => {
        Axios.put(`http://localhost:5000/stadium/disable/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'ยกเลิกการใช้งานพื้นที่กีฬาสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getStadiumData();
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
            selector: (row) => row.name,
        },
        {
            name: "รูป",
            selector: (row) => (
                <img
                    src={`http://localhost:5000/images/${row.img}`}
                    style={{ maxWidth: "35%", height: "auto" }}
                />
            ),
        },
        {
            name: "จัดการ",
            selector: (row) => {
                return (
                    <div className="btn-group">
                        <button className="btn btn-primary" onClick={() => handleShowEditModal(row.stadium_id)}>
                            แก้ไขพื้นที่กีฬา
                        </button>
                        {row.status ? (
                            <button className="btn btn-danger" onClick={() => disableStadium(row.stadium_id)}>
                                ยกเลิกการใช้งาน
                            </button>
                        ) : (
                            <button className="btn btn-warning" onClick={() => enableStadium(row.stadium_id)}>
                                เปิดใช้งาน
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    // ฟังก์ชันกรองข้อมูลตามคำค้น
    useEffect(() => {
        const filtered = stadiumData.filter((data) =>
            data.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, stadiumData]);

    useEffect(() => {
        getStadiumData()
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
                <h4 className="fw-bold">จัดการพื้นที่กีฬา</h4>
                <div className="d-flex">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="ค้นหา"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "300px" }}
                    />
                    <button className="btn btn-primary" onClick={handleShowAddModal}>
                        <FaPlus /> เพิ่มพื้นที่กีฬา
                    </button>
                </div>
            </div>
            <hr />
            <DataTable columns={columns} data={filteredData} pagination />

            {/* Modal เพิ่ม */}
            <Modal show={showAdd} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>เพิ่มพื้นที่กีฬา</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="username">ชื่อ</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>รูปภาพ</label>
                        <input type="file" className="form-control" onChange={(e) => setSelectedImage(e.target.files[0])} />
                    </div>
                    {selectedImage && (
                        <div className="mb=3">
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                style={{ maxWidth: "70%", height: "auto" }}
                            />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>
                        ปิด
                    </Button>
                    <Button variant="primary" onClick={submit}>
                        ยืนยัน
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal แก้ไข */}
            <Modal show={showEdit} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>แก้ไขพื้นที่กีฬา</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="username">ชื่อ</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label>รูปภาพ</label>
                        <input type="file" className="form-control" onChange={(e) => setSelectedImage(e.target.files[0])} />
                    </div>
                    <div className="mb=3">
                        <img
                            src={selectedImage ? URL.createObjectURL(selectedImage) : `http://localhost:5000/images/${showEditImage}`}
                            style={{ maxWidth: "70%", height: "auto" }}
                        />
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

export default Stadium;
