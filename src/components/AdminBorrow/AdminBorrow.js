import React, { useContext, useEffect, useState } from "react";
import "./AdminBorrow.css";
import DataTable from "react-data-table-component";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Swal from 'sweetalert2'

function AdminBorrow() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [borrowData, setBorrowData] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const getBorrowData = () => {
        Axios.get("http://localhost:5000/sportborrow", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    setBorrowData(resp.data.data)
                    setFilteredData(resp.data.data);
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            })
    }

    const formattedDateTime = (data) => {
        const formated = new Date(data);
        return `${formated.toLocaleDateString()} - ${formated.toLocaleTimeString()}`;
    }

    const getStatusText = (status) => {
        switch (status) {
            case "wait": return "รอติดตามเอกสาร";
            case "approve": return "อนุมัติเอกสาร";
            case "ongoing": return "กำลังใช้งาน";
            case "success": return "เสร็จสิ้น";
            case "cancel": return "ยกเลิก";
            default: return "";
        }
    };

    const approveBorrow = (id) => {
        Axios.put(`http://localhost:5000/sportborrow/approve/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'อนุมัติเอกสารสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getBorrowData();
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            });
    }

    const receiveBorrow = (id) => {
        Axios.put(`http://localhost:5000/sportborrow/receive/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'รับอุปกรณ์สำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getBorrowData();
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            });
    }

    const returnBorrow = (id) => {
        Axios.put(`http://localhost:5000/sportborrow/return/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'รับคืนสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getBorrowData();
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            });
    }

    const cancelBorrow = (id) => {
        Axios.put(`http://localhost:5000/sportborrow/cancel/${id}`, {}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then((resp) => {
                if (resp.data.status === "ok") {
                    Swal.fire({
                        title: 'ยกเลิกสำเร็จ',
                        icon: 'success',
                        confirmButtonText: 'ตกลง'
                    })
                    getBorrowData();
                }
            })
            .catch((err) => {
                if (err.response.data.message) {
                    alert(err.response.data.message)
                }
            });
    }

    // คอมโพเนนต์สำหรับแถวรอง
    const ExpandedComponent = ({ data }) => (
        <div style={{ padding: "15px 20px", backgroundColor: "#f9f9f9" }}>
            {data.items && data.items.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#e0e0e0" }}>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>อุปกรณ์</th>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>จำนวน</th>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>วันที่ยืม</th>
                            <th style={{ padding: "8px", border: "1px solid #ddd" }}>วันที่คืน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, index) => (
                            <tr key={index} style={{ border: "1px solid #ddd" }}>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.name}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>{item.count}</td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                    {formattedDateTime(item.borrow_date)}
                                </td>
                                <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                    {formattedDateTime(item.return_date)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>ไม่มีรายการการยืม</p>
            )}
        </div>
    );

    const columns = [
        {
            name: "เอกสารการยืม",
            selector: (row) => row.document_id,
        },
        {
            name: "วันที่ยืม",
            selector: (row) => formattedDateTime(row.start),
            sortable: true,
            id: "start", // เพิ่ม ID สำหรับคอลัมน์วันที่ยืม
            sortable: true, // เปิดใช้งานการเรียงลำดับ
        },
        {
            name: "วันที่คืน",
            selector: (row) => formattedDateTime(row.end),
            sortable: true,
        },
        {
            name: "สถานะ",
            selector: (row) => getStatusText(row.status),
            sortable: true,
        },
        {
            name: "จัดการ",
            selector: (row) => (
                <>
                    <div className="btn-group">
                        {row.status !== "success" && row.status !== "cancel" ? (
                            <button className="btn btn-danger" onClick={() => cancelBorrow(row.document_id)}>
                                ยกเลิก
                            </button>
                        ) : ""}
                        {row.status === "wait" && (
                            <button className="btn btn-success" onClick={() => approveBorrow(row.document_id)}>
                                อนุมัติเอกสาร
                            </button>
                        )}
                        {row.status === "approve" && (
                            <button className="btn btn-success" onClick={() => receiveBorrow(row.document_id)}>
                                รับอุปกรณ์
                            </button>
                        )}
                        {row.status === "ongoing" && (
                            <button className="btn btn-success" onClick={() => returnBorrow(row.document_id)}>
                                รับคืน
                            </button>
                        )}
                    </div>
                </>
            ),
        },
    ];

    useEffect(() => {
        const filtered = borrowData.filter((data) =>
            String(data.document_id).includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, borrowData]);

    useEffect(() => {
        getBorrowData()
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
                <h4 className="fw-bold">จัดการข้อมูลยืมคืน</h4>
                <div><input
                    type="text"
                    className="form-control"
                    placeholder="ค้นหาเอกสารการยืม"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "300px" }}
                /></div>
            </div>
            <hr />
            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                defaultSortFieldId="start"
                defaultSortAsc={false}
            />

        </>
    );
}

export default AdminBorrow;
