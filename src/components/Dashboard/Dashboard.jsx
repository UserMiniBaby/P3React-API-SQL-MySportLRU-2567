import React, { useContext, useEffect } from 'react';
import { FaClipboardList, FaClipboardCheck, FaBell, FaTimes } from 'react-icons/fa'; // นำเข้าไอคอนที่ต้องการใช้
import { ImCancelCircle } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../context/AuthContext";

function EquipmentRequest() {

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  if (!user) return null;

  useEffect(() => {
    if (user.roles === "External" || user.roles === "Internal") {
      navigate("/");
  }
  }, [])

  return (
    <div className="row">
      {/* รายกาจองพื้นที่กีฬา */}
      <div className="col-12 col-md-6 col-lg-3">
        <div className="bg-danger rounded-2 shadow-lg px-3 py-2 text-white">
          <div className="d-flex align-items-center justify-content-between">
            <h4>รายการคำขอ</h4>
            <h2 className="text-white">18</h2> {/* เปลี่ยนเป็นสีขาว */}
          </div>
          <div className="text-center" style={{ fontSize: '3rem' }}>
            <FaBell  /> {/* ไอคอนรายการคำขอ */}
          </div>
        </div>
      </div>

      {/* คำขอที่ได้รับการอนุมัติ */}
      <div className="col-12 col-md-6 col-lg-3">
        <div className="bg-success rounded-2 shadow-lg px-3 py-2 text-white">
          <div className="d-flex align-items-center justify-content-between">
            <h4>คำขอที่ได้รับการอนุมัติ</h4>
            <h2 className="text-white">31</h2> {/* เปลี่ยนเป็นสีขาว */}
          </div>
          <div className="text-center" style={{ fontSize: '3rem' }}>
            <FaClipboardCheck /> {/* ไอคอนอนุมัติคำขอ */}
          </div>
        </div>
      </div>

      {/* คำขอที่ได้รับการปฏิเสธ */}
      <div className="col-12 col-md-6 col-lg-3">
        <div className="bg-dark rounded-2 shadow-lg px-3 py-2 text-white">
          <div className="d-flex align-items-center justify-content-between">
            <h4>คำขอที่ได้รับการปฏิเสธ</h4>
            <h2 className="text-white">5</h2> {/* เปลี่ยนเป็นสีขาว */}
          </div>
          <div className="text-center" style={{ fontSize: '3rem' }}>
            <ImCancelCircle  style={{ color: 'red' }} /> {/* ไอคอนคำขอที่ปฏิเสธ */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentRequest;
