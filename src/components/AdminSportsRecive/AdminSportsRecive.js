import React, { useContext, useEffect, useState } from "react";
import "./AdminSportsRecive.css";
import DataTable from "react-data-table-component";
import Axios from "axios";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AdminSportsRecive() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [reciveData, setReciveData] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    function formattedDateTime(datetime) {
        const utcString = "2025-06-16T05:28:52.000Z";
        const localDate = new Date(utcString);

        return localDate.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })
    }

    const getReciveData = () => {
        Axios.get("http://localhost:5000/sportequipment/recive")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    console.log(resp.data.data)
                    setReciveData(resp.data.data)
                    setFilteredData(resp.data.data);
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

                console.error("Error saving checkout data:", err);
            })
    }

    const columns = [
        {
            name: "อุปกรณ์",
            sortable: true,
            selector: (row) => row.name,
        },
        {
            name: "จำนวน",
            sortable: true,
            selector: (row) => row.amount,
        },
        {
            name: "ข้อความ",
            sortable: true,
            selector: (row) => row.note,
        },
        {
            name: "วันที่",
            sortable: true,
            selector: (row) => formattedDateTime(row.date),
        },
        {
            name: "โดย",
            sortable: true,
            selector: (row) => row.admin,
        },
    ];

    useEffect(() => {
        const filtered = reciveData.filter((data) =>
            data.admin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.date.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchQuery, reciveData]);

    useEffect(() => {
        getReciveData()
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
                <h4 className="fw-bold">การรับอุปกรณ์</h4>
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
            <DataTable columns={columns} data={filteredData} pagination />
        </>
    );
}

export default AdminSportsRecive;
