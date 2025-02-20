const router = require("express").Router();
const auth = require("../middleware/auth");
const conn = require("../config/database");

router.get("/", auth, (req, res) => {
    conn.execute(
        "SELECT * FROM user WHERE email = ?",
        [req.auth.email],
        function (err, results, fields) {
            if (err) {
                res.status(500).json({
                    status: "error",
                    message: `Server error : ${err}`,
                });
                return;
            }
            if (results.length === 0) {
                res.status(400).json({
                    status: "error",
                    message: "user not exist",
                });
                return;
            }
            res.status(200).json({
                status: "ok",
                message: "success",
                data: results[0],
            });
        }
    );
});

router.put("/update", auth, (req, res) => {
    const { first_name, last_name, phonenumber, password } = req.body;
    if (first_name !== "" && last_name !== "" && phonenumber !== "") {

        let stmt = "UPDATE user SET first_name = ?, last_name = ?, phonenumber = ? WHERE email = ?";
        let execute = [first_name, last_name, phonenumber, req.auth.email];

        if (password !== "") {
            stmt = "UPDATE user SET first_name = ?, last_name = ?, phonenumber = ?, password = ? WHERE email = ?";
            execute = [first_name, last_name, phonenumber, password, req.auth.email];
        }

        conn.execute(stmt, execute, function (err, results, fields) {
            if (err) {
                res.status(500).json({
                    status: "error",
                    message: `Server error : ${err}`,
                });
                return;
            }
            res.status(200).json({
                status: "ok",
                message: "แก้ไขข้อมูลสำเร็จ",
            });
        });
    } else {
        res.status(400).json({
            status: "error",
            message: "กรอกข้อมูลให้ครบถ้วน",
        });
        return;
    }
});


module.exports = router;
