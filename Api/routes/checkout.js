const router = require("express").Router();
const auth = require("../middleware/auth");
const conn = require("../config/database");

// helper function เปลี่ยน conn.execute เป็น Promise
const executeQuery = (sql, params) => {
    return new Promise((resolve, reject) => {
        conn.execute(sql, params, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

router.post("/", auth, async (req, res) => {
    const { data, firstName, lastName, email, phoneNumber, agency, objective } = req.body;

    function generateCodeWithDate() {
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2); // ปี 2 หลัก
        const mm = String(now.getMonth() + 1).padStart(2, '0'); // เดือน
        const dd = String(now.getDate()).padStart(2, '0'); // วัน

        const datePart = dd + mm + yy; // YYMMDD (6 หลัก)

        const randomPart = Math.floor(1000 + Math.random() * 9000); // 4 หลักสุ่ม

        return datePart + randomPart;
    }

    try {
        // ตรวจสอบทั้งหมดก่อนการ insert
        for (const el of data) {
            const startDate = `${el.selectedDates[0]} ${el.startTime}`;
            const endDate = `${el.selectedDates[el.selectedDates.length - 1]} ${el.endTime}`;

            if (el.type === "sport") {
                const [sportResult] = await executeQuery(
                    `SELECT sport_id, quantity FROM equipment WHERE name = ?`,
                    [el.itemName]
                );

                if (!sportResult) {
                    throw new Error(`Sport equipment "${el.itemName}" not found`);
                }

                const sportEquipmentId = sportResult.sport_id;
                const totalQuantity = sportResult.quantity;

                const overlappingBorrowings = await executeQuery(
                    `SELECT IFNULL(SUM(bd.quantity), 0) AS total_borrowed
                     FROM borrowingdetails bd
                     JOIN borrowingdocuments bdoc ON bd.document_id = bdoc.document_id
                     WHERE bd.sport_id = ?
                       AND (
                            (? BETWEEN bd.borrow_date AND bd.return_date) OR
                            (? BETWEEN bd.borrow_date AND bd.return_date) OR
                            (bd.borrow_date BETWEEN ? AND ?) OR
                            (bd.return_date BETWEEN ? AND ?)
                       )
                       AND bdoc.status NOT IN ('cancel', 'success')`,
                    [
                        sportEquipmentId,
                        startDate, endDate,
                        startDate, endDate,
                        startDate, endDate
                    ]
                );

                const alreadyBorrowed = overlappingBorrowings[0]?.total_borrowed ?? 0;
                const remaining = totalQuantity - alreadyBorrowed;

                if (remaining < el.quantity) {
                    return res.status(409).json({
                        status: "error",
                        message: `${el.itemName} ไม่ว่างช่วงเวลาดังกล่าว`
                    });
                }

            } else if (el.type === "stadium") {
                const [stadiumResult] = await executeQuery(
                    `SELECT stadium_id FROM stadium WHERE name = ?`,
                    [el.itemName]
                );

                if (!stadiumResult) {
                    throw new Error(`Stadium "${el.itemName}" not found`);
                }

                const stadiumId = stadiumResult.stadium_id;

                const existingReservations = await executeQuery(
                    `SELECT 1 
         FROM stadiumreservationdetail srd
         JOIN stadiumdocuments sdoc ON srd.sdocument_id  = sdoc.sdocument_id 
         WHERE srd.stadium_id = ?
         AND (
            (? BETWEEN srd.reserve_date AND srd.reserve_end) OR
            (? BETWEEN srd.reserve_date AND srd.reserve_end) OR
            (srd.reserve_date BETWEEN ? AND ?) OR
            (srd.reserve_end BETWEEN ? AND ?)
         )
         AND sdoc.status NOT IN ('cancel', 'success')`,
                    [stadiumId, startDate, endDate, startDate, endDate, startDate, endDate]
                );

                if (existingReservations.length > 0) {
                    return res.status(409).json({
                        status: "error",
                        message: `${el.itemName} ไม่ว่างช่วงเวลาดังกล่าว`
                    });
                }
            }
        }

        // ถ้าผ่านการตรวจสอบทั้งหมด ค่อยเริ่ม insert
        let stadiumDocId = null;
        let sportDocId = null;

        for (const el of data) {
            const startDate = `${el.selectedDates[0]} ${el.startTime}`;
            const endDate = `${el.selectedDates[el.selectedDates.length - 1]} ${el.endTime}`;

            if (el.type === "sport") {
                const [sportResult] = await executeQuery(
                    `SELECT sport_id FROM equipment WHERE name = ?`,
                    [el.itemName]
                );
                const sportEquipmentId = sportResult.sport_id;

                if (!sportDocId) {
                    const insertId = generateCodeWithDate();
                    const results = await executeQuery(
                        `INSERT INTO borrowingdocuments (document_id, first_name, last_name, phonenumber, email, user_id, agency, objective) 
                         VALUES (?, ?, ?, ?, ?, (SELECT user_id FROM user WHERE email = ?), ?, ?)`,
                        [insertId, firstName, lastName, phoneNumber, email, email, agency, objective]
                    );
                    
                    sportDocId = insertId;
                }

                await executeQuery(
                    `INSERT INTO borrowingdetails (borrow_date, return_date, sport_id, document_id, quantity) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [startDate, endDate, sportEquipmentId, sportDocId, el.quantity]
                );

            } else if (el.type === "stadium") {
                const [stadiumResult] = await executeQuery(
                    `SELECT stadium_id FROM stadium WHERE name = ?`,
                    [el.itemName]
                );
                const stadiumDbId = stadiumResult.stadium_id;

                if (!stadiumDocId) {
                    const insertId = generateCodeWithDate();
                    const results = await executeQuery(
                        `INSERT INTO stadiumdocuments (sdocument_id, first_name, last_name, phonenumber, email, user_id, agency, objective) 
                         VALUES (?, ?, ?, ?, ?, (SELECT user_id FROM user WHERE email = ?), ?, ?)`,
                        [insertId, firstName, lastName, phoneNumber, email, email, agency, objective]
                    );
                    stadiumDocId = insertId;
                }

                await executeQuery(
                    `INSERT INTO stadiumreservationdetail (reserve_date, reserve_end, stadium_id, sdocument_id) 
                     VALUES (?, ?, ?, ?)`,
                    [startDate, endDate, stadiumDbId, stadiumDocId]
                );
            }
        }

        res.status(200).json({ status: "ok" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: `Server error: ${err.message}` });
    }
});

module.exports = router;
