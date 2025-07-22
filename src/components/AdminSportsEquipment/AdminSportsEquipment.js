import React, { useContext, useEffect, useState } from "react";
import "./AdminSportsEquipment.css";
import DataTable from "react-data-table-component";
import { FaRegTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Axios from "axios";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AdminSportsEquipment() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showReduce, setShowReduce] = useState(false);
    const [showRecive, setShowRecive] = useState(false);
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null)
    const [equipmentData, setEquipmentData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [reduceId, setReduceId] = useState(null);
    const [reciveId, setReciveId] = useState(null);
    const [showEditImage, setShowEditImage] = useState("");
    const [reduceAmount, setReduceAmount] = useState(0);
    const [reduceNote, setReduceNote] = useState("");
    const [reciveAmount, setReciveAmount] = useState(0);
    const [reciveNote, setReciveNote] = useState("");

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

        Axios.get(`http://localhost:5000/sportequipment/${id}`)
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setName(resp.data.data.name);
                    setQuantity(resp.data.data.quantity);
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

    const handleCloseReduceModal = () => {
        setShowReduce(false)
        setReduceId(null);
        setReduceAmount(0);
        setReduceNote("");
    };

    const handleCloseReciveModal = () => {
        setShowRecive(false)
        setReciveId(null);
        setReciveAmount(0);
        setReciveNote("");
    };

    const handleShowReduceModal = (id) => {
        setReduceId(id);
        setShowReduce(true)
    };

    const handleShowReciveModal = (id) => {
        setReciveId(id);
        setShowRecive(true)
    };

    const getEquipment = () => {
        Axios.get("http://localhost:5000/sportequipment")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setEquipmentData(resp.data.data)
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

            Axios.put(`http://localhost:5000/sportequipment/edit/${editId}`, formData, {
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
                        getEquipment();
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response.data.message) {
                        alert(err.response.data.message)
                    }
                });
        } else {
            alert("กรอกข้อมูลให้ครบถ้วน")
        }
    };

    const submitReduce = () => {
        console.log(reduceId)
        if (reduceNote !== "" && reduceAmount !== "") {
            Axios.put(`http://localhost:5000/sportequipment/reduce/${reduceId}`, {
                amount: reduceAmount,
                note: reduceNote,
            }, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            })
                .then((resp) => {
                    if (resp.data.status === "ok") {
                        Swal.fire({
                            title: 'แจ้งเตือน',
                            text: 'จำหน่วยอุปกรณ์สำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        })
                        handleCloseReduceModal()
                        setReduceAmount("");
                        setReduceNote(0);
                        getEquipment();
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

    const submitRecive = () => {
        if (reciveNote !== "" && reciveNote !== "") {
            Axios.put(`http://localhost:5000/sportequipment/recive/${reciveId}`, {
                amount: reciveAmount,
                note: reciveNote,
            }, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            })
                .then((resp) => {
                    if (resp.data.status === "ok") {
                        Swal.fire({
                            title: 'แจ้งเตือน',
                            text: 'รับอุปกรณ์สำเร็จ',
                            icon: 'success',
                            confirmButtonText: 'ตกลง'
                        })
                        handleCloseReciveModal()
                        setReciveNote("");
                        setReciveAmount(0);
                        getEquipment();
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

    const submit = () => {
        if (selectedImage && name !== "") {
            const formData = new FormData();
            formData.append("img", selectedImage);
            formData.append("name", name);

            Axios.post("http://localhost:5000/sportequipment/add", formData, {
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
                        getEquipment();
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
        Axios.put(`http://localhost:5000/sportequipment/enable/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'เปิดใช้งานอุปกรณ์กีฬาสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getEquipment();
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            });
    }

    const disableStadium = (id) => {
        Axios.put(`http://localhost:5000/sportequipment/disable/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'ยกเลิกการใช้อุปกรณ์กีฬาสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getEquipment();
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
            sortable: true,
        },
        {
            name: "จำนวน",
            selector: (row) => row.quantity,
            width: "150px",
            sortable: true,
        },
        {
            name: "คงเหลือ",
            selector: (row) => row.available,
            width: "150px",
            sortable: true,
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
                        <button className="btn btn-light" onClick={() => handleShowReciveModal(row.sport_id)}>
                            รับ
                        </button>
                        <button className="btn btn-dark" onClick={() => handleShowReduceModal(row.sport_id)}>
                            จำหน่าย
                        </button>
                        <button className="btn btn-primary" onClick={() => handleShowEditModal(row.sport_id)}>
                            แก้ไข
                        </button>
                        {row.status ? (
                            <button className="btn btn-danger" onClick={() => disableStadium(row.sport_id)}>
                                ยกเลิก
                            </button>
                        ) : (
                            <button className="btn btn-warning" onClick={() => enableStadium(row.sport_id)}>
                                เปิดใช้งาน
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        const filtered = equipmentData.filter((data) =>
            data.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, equipmentData]);

    useEffect(() => {
        getEquipment()
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
                <h4 className="fw-bold">จัดการอุปกรณ์กีฬา</h4>
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
                        <FaPlus /> เพิ่มอุปกรณ์กีฬา
                    </button>
                </div>
            </div>
            <hr />
            <DataTable columns={columns} data={filteredData} pagination />

            {/* Modal เพิ่ม */}
            <Modal show={showAdd} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>เพิ่มอุปกรณ์กีฬา</Modal.Title>
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
                    <Modal.Title>แก้ไขอุปกรณ์กีฬา</Modal.Title>
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

            {/* Modal จำหน่าย */}
            <Modal show={showReduce} onHide={handleCloseReduceModal}>
                <Modal.Header closeButton>
                    <Modal.Title>จำหน่ายอุปกรณ์</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="amount">จำนวน</label>
                        <input
                            type="number"
                            className="form-control"
                            id="amount"
                            value={reduceAmount}
                            onChange={(e) =>
                                setReduceAmount(e.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="note">ข้อความ</label>
                        <input
                            type="text"
                            className="form-control"
                            id="note"
                            value={reduceNote}
                            onChange={(e) =>
                                setReduceNote(e.target.value)
                            }
                            required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseReduceModal}>
                        ปิด
                    </Button>
                    <Button variant="primary" onClick={submitReduce}>
                        ยืนยัน
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal รับอุปกรณ์ */}
            <Modal show={showRecive} onHide={handleCloseReciveModal}>
                <Modal.Header closeButton>
                    <Modal.Title>รับอุปกรณ์</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="amount">จำนวน</label>
                        <input
                            type="number"
                            className="form-control"
                            id="amount"
                            value={reciveAmount}
                            onChange={(e) =>
                                setReciveAmount(e.target.value)
                            }
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="note">ข้อความ</label>
                        <input
                            type="text"
                            className="form-control"
                            id="note"
                            value={reciveNote}
                            onChange={(e) =>
                                setReciveNote(e.target.value)
                            }
                            required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseReciveModal}>
                        ปิด
                    </Button>
                    <Button variant="primary" onClick={submitRecive}>
                        ยืนยัน
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AdminSportsEquipment;
