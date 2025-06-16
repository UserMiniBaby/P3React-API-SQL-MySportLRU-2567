import React, { useContext, useEffect, useState } from "react";
import "./AdminSportsReduce.css";
import DataTable from "react-data-table-component";
import { FaRegTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Axios from "axios";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function AdminSportsReduce() {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [reduceData, setReduceData] = useState([]);

    function formattedDateTime(datetime) {
        const utcString = "2025-06-16T05:28:52.000Z";
        const localDate = new Date(utcString);

        return localDate.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })
    }

    const getReduceData = () => {
        Axios.get("http://localhost:5000/sportequipment/reduce")
            .then((resp) => {
                if (resp.data.status === "ok") {
                    console.log(resp.data.data)
                    setReduceData(resp.data.data)
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
            selector: (row) => row.name,
        },
        {
            name: "จำนวน",
            selector: (row) => row.amount,
        },
        {
            name: "ข้อความ",
            selector: (row) => row.note,
        },
        {
            name: "วันที่",
            selector: (row) => formattedDateTime(row.date),
        },
        {
            name: "โดย",
            selector: (row) => row.admin,
        },
    ];

    useEffect(() => {
        getReduceData()
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
                <h4 className="fw-bold">การจำหน่ายอุปกรณ์</h4>
            </div>
            <hr />
            <DataTable columns={columns} data={reduceData} pagination />
        </>
    );
}

export default AdminSportsReduce;
