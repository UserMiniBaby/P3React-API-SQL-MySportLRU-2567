const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conn = require("../config/database");

router.post("/register", (req, res) => {
    const { first_name, last_name, email, phonenumber, password } = req.body;

    if (first_name == "" && last_name == "" && email == "" && password == "") {
        res.status(400).json({
            status: "error",
            message: "กรอกข้อมูลให้ครบถ้วน",
        });
        return;
    }

    if (phonenumber.length != 10) {
        res.status(400).json({
            status: "error",
            message: "เบอร์โทรศัพท์ไม่ถูกต้อง",
        });
        return;
    }

    let roles = "External";

    let email_formatted = email.split("@");

    if (email_formatted[1] === "lru.ac.th") {
        roles = "Internal"
    }

    conn.execute(
        "SELECT COUNT(*) as count FROM user WHERE email = ?",
        [email],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({ status: "error", massage: err });
                return;
            }
            if (results[0].count != 0) {
                res.status(400).json({
                    status: "error",
                    message: "มี email นี้ในระบบแล้ว",
                });
                return;
            }
            if (err) {
                res.status(400).json({ status: "error", massage: err });
                return;
            }
            conn.execute(
                "INSERT INTO user (first_name, last_name, password, phonenumber, roles, email) VALUES (?, ?, ?, ?, ?, ?)",
                [first_name, last_name, password, phonenumber, roles, email],
                function (err, results, fields) {
                    if (err) {
                        res.status(400).json({
                            status: "error",
                            message: err,
                        });
                        return;
                    }
                    res.status(200).json({ status: "ok" });
                    return;
                }
            );
        }
    );
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    conn.execute(
        "SELECT * FROM user WHERE email = ?",
        [email],
        function (err, results, fields) {
            if (err) {
                res.status(400).json({ status: "error", message: err });
                return;
            }
            if (results.length == 0) {
                res.status(400).json({
                    status: "error",
                    message: "ไม่พบบัญชีผู้ใช้",
                });
                return;
            }

            if (password === results[0].password) {
                // Access token
                const token = jwt.sign(
                    { email: results[0].email },
                    process.env.SECERT_KET,
                    { expiresIn: "1d" }
                );
                // Delete password property from object db response
                const userResponse = results.map((user) => {
                    delete user.password;
                    return user;
                });
                res.status(200).json({
                    status: "ok",
                    message: "เข้าสู่ระบบสำเร็จ",
                    token: token,
                    data: userResponse[0],
                });
            } else {
                res.status(400).json({
                    status: "error",
                    message: "รหัสผ่านไม่ถูกต้อง",
                });
            }
        }
    );
});

module.exports = router;
