import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Axios from "axios"

const Layout = () => {

    const navigate = useNavigate();
    const { loggedIn, saveUser } = useContext(AuthContext);

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

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
};

export default Layout;
