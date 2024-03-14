import React, { useEffect, useState } from "react";
import "../../style/css/sb-admin-2.min.css"; // You may need to adjust the path to your CSS file.
import "./Dashboard.css";
import axios from "axios";
import QRCode from "qrcode";
import { BASEURL } from "./constant/constant";
import ConfirmationPopup from "./popup/Popup";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const userid = sessionStorage.getItem("userId");

  const [addUserModel, setAddUserModel] = useState(false);
  const [docData, setDocData] = useState([]);
  const [singaldocData, setSingalDocData] = useState({});

  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAdderss] = useState("");
  const [mobile, setMobile] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  //logout popup logic
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = () => {
    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("userId");

    navigate("/");
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handelAddDoctor = () => {
    setAddUserModel(true);
  };
  const handelCloseModel = () => {
    setAddUserModel(false);
    setShowInfo(false);
    setSingalDocData({});
  };

  useEffect(() => {
    GetDoctorList();
  }, [searchText]);

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const isEmailValidate = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
    if (
      !name.trim() ||
      !qualification.trim() ||
      !city.trim() ||
      !state.trim() ||
      !email.trim() ||
      !address.trim() ||
      !mobile.trim()
    ) {
      toast.error("Missing Required Field");
      return;
    }
    if (!isEmailValidate) {
      toast.error("Email is not valid");
      return;
    }
    if (mobile.length != 10) {
      toast.error("Provide 10 digit mobile number");
      return;
    }

    setShowConfirmation(true);
  };
  const handleConfirm = async () => {
    setShowConfirmation(false);
    setAddUserModel(false);

    try {
      const res = await axios.post(`${BASEURL}/DoctorApi/ManageDoctor`, {
        doctorName: name,
        address: address,
        state: state,
        city: city,
        mobile: mobile,
        emailId: email,
        qualification: qualification,
        userId: userid,
      });
       console.log("adding doctor",res)
      if (res?.data?.errorCode == "0") {
        const responseData = res?.data?.responseData;
        //const [doctorId, ticketId] = responseData.split(",");
        if (responseData) {
          const qrCodeUrl = await generateQRCode(responseData);
          const data = {
            name,
            qualification,
            address,
            state,
            city,
            mobile,
            email,
            qrCodeUrl,
          };
          toast.success("Doctor created successfully");
          await sendEmailWithQRCode(data);

          await GetDoctorList();
        } else {
          toast.error(res.data.errorDetail);
        }
      } else {
        toast.error(res?.data?.errorDetail);
        //toast.error("Error in adding Doctor");
      }
    } catch (error) {
      console.log(error);
     toast.error("Error in adding Doctor");
    }

    setName("");
    setQualification("");
    setCity("");
    setAdderss("");
    setEmail("");
    setState("");
    setMobile("");
  };

  async function sendEmailWithQRCode(data) {
    try {
      const res = await axios.post(
        "https://calenderapi.netcastservice.co.in/sendMail",
        //'http://localhost:8000/sendMail',
        data
      );
      console.log("inside send mail function", res);
    } catch (error) {
      console.log("failed to send mail", error);
      toast.error("Error in sending mail");
    }
  }

  const generateQRCode = async (data) => {
    //const formattedData = `Doctor ID: ${doctorId}\nTicket ID: ${ticketId}`;
    try {
      const qrCodeUrl = await QRCode.toDataURL(data);
      return qrCodeUrl;
    } catch (error) {
      console.error("Failed to generate QR code:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handelShowInfo = (docid) => {
    setShowInfo(true);

    GetDoctorData("" + docid);
  };
  async function GetDoctorList() {
    try {
      const res = await axios.post(
        `${BASEURL}/DoctorApi/GetDoctorsListSearch`,
        { searchText: searchText, userId: userid }
      );

      console.log("res", res);
      setDocData(res?.data?.responseData);
    } catch (error) {
      console.log(error);
    }
  }

  async function GetDoctorData(docid) {
    try {
      const res = await axios.post(`${BASEURL}/DoctorApi/GetDoctorDetail`, {
        doctorId: docid,
      });

      setSingalDocData(res?.data?.responseData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div id="wrapper">
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
            <div>
              <img
                src="/images/Logo1.png"
                alt="logo_image"
                className="in_logo"
              />
            </div>

            <ul className="navbar-nav ml-auto">
              <li className="nav-item dropdown no-arrow">
                {/* <img src="/images/Galaxy.png" alt="" className="gal_logo" /> */}
              </li>

              <li className="nav-item dropdown no-arrow dropdown1">
                <div className="nav-link dropdown-toggle">
                  <img
                    className="img-profile rounded-circle"
                    src="/images/userimg.png"
                    alt="Profile"
                  />
                </div>

                <div className="dropdown-content">
                  <p
                    className="dropdown-item ditem"
                    onClick={handleLogoutClick}
                  >
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                    Logout
                  </p>
                </div>
              </li>
            </ul>
          </nav>
          <div className="container-fluid">
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <form className="d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-white border-1 small"
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                    placeholder="Search..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
                      <i className="fas fa-search fa-sm"></i>
                    </button>
                  </div>
                </div>
              </form>
              <button
                onClick={handelAddDoctor}
                className="btn btn-primary btn-icon-split"
              >
                <span className="icon text-white-50">
                  <i className="fas fa-plus"></i>
                </span>
                <span className="text">Add Doctor</span>
              </button>
            </div>
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="table-responsive">
                  <table
                    className="table table-bordered table-lay"
                    id="dataTable"
                    width="100%"
                    cellSpacing="0"
                  >
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Qualification</th>
                        <th>City</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        {/* <th>Email</th> */}
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docData &&
                        docData.map((e) => (
                          <tr key={e.doctorId}>
                            <td>{e.doctorName}</td>
                            <td>{e.qualification}</td>
                            <td>{e.city}</td>
                            <td>{e.mobile}</td>
                            <td>{e.address}</td>
                            {/* <td>{e.emailId}</td> */}
                            <td>
                              <button
                                className="btn btn-info m-1"
                                style={{ borderRadius: "50px" }}
                                onClick={() => handelShowInfo(e.doctorId)}
                              >
                                <i className="fas fa-info fa-fw"></i>
                                Info
                              </button>
                            </td>
                          </tr>
                        ))}
                      {/* Add more table rows as needed */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="addDoc"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            {/* Add Doctor Modal Content */}
          </div>
          <div
            className="modal fade"
            id="editDoc"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            {/* Edit Doctor Modal Content */}
          </div>
          <div
            className="modal fade"
            id="docInfo"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            {/* Doctor Info Modal Content */}
          </div>
        </div>
        <footer className="sticky-footer bg-white">
          <div className="container my-auto">
            <div className="copyright text-center my-auto">
              {/* Footer content */}
            </div>
          </div>
        </footer>
        <a className="scroll-to-top rounded" href="#page-top">
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        {/* Logout Modal Content */}
      </div>

      {addUserModel && (
        <div className="addusermodeld">
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #238ec7, #4bb8e7)",
                  color: "#fff",
                }}
              >
                <h5 className="modal-title">Add Doctor</h5>
                <button
                  onClick={handelCloseModel}
                  type="button"
                  className="close"
                  style={{ color: "#fff" }}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddDoctor}>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          placeholder=""
                        />
                        <label className="label">Name Of Doctor</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          onChange={(e) => {
                            setQualification(e.target.value);
                          }}
                          placeholder=""
                        />
                        <label className="label">Qualification</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          onChange={(e) => {
                            setCity(e.target.value);
                          }}
                          placeholder=""
                        />
                        <label className="label">City</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          onChange={(e) => {
                            setState(e.target.value);
                          }}
                          placeholder=""
                        />
                        <label className="label">State</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          placeholder=""
                        />
                        <label className="label">Email</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          onChange={(e) => {
                            setMobile(e.target.value);
                          }}
                          placeholder=""
                          maxLength="10"
                          pattern="\d{10}"
                          title="Please enter exactly 10 digits"
                          onKeyDown={(e) => {
                            if (
                              !/\d/.test(e.key) &&
                              e.key !== "Backspace" &&
                              e.key !== "Delete"
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                        <label className="label">Mobile</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          onChange={(e) => {
                            setAdderss(e.target.value);
                          }}
                          placeholder=""
                        />
                        <label className="label">Address</label>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary mx-auto">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#ca1111",
                  textAlign: "left",
                  fontWeight: "700",
                  padding: "20px",
                }}
              >
                Note : All fields are mandatory to fill.
              </div>
            </div>
          </div>
          {showConfirmation && (
            <ConfirmationPopup
              message="Are you sure you want to Add Doctor?"
              onConfirm={() => handleConfirm()}
              onCancel={handleCancel}
            />
          )}
        </div>
      )}

      {showInfo && (
        <div className="addusermodeld">
          <div className="modal-dialog">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #238ec7, #4bb8e7)",
                  color: "#fff",
                }}
              >
                <h5 className="modal-title">Doctor Info</h5>
                <button
                  onClick={handelCloseModel}
                  type="button"
                  className="close"
                  style={{ color: "#fff" }}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          value={singaldocData.doctorName}
                          className="form-control"
                          id="inputName4"
                          name="name"
                          placeholder=" "
                        />
                        <label className="label">Name Of Doctor</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          value={singaldocData.qualification}
                          className="form-control"
                          id="state"
                          name="state"
                          placeholder=" "
                        />
                        <label className="label">Qualification</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          value={singaldocData.city}
                          className="form-control"
                          id="city"
                          name="city"
                          placeholder=" "
                        />
                        <label className="label">City</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          value={singaldocData.state}
                          className="form-control"
                          id="city"
                          name="city"
                          placeholder=" "
                        />
                        <label className="label">State</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          value={singaldocData.emailId}
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder=" "
                        />
                        <label className="label">Email</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          value={singaldocData.mobile}
                          className="form-control"
                          id="mobile"
                          name="mobile"
                          placeholder=" "
                        />
                        <label className="label">Mobile</label>
                      </div>
                    </div>
                    <div className="form-group col-md-6">
                      <div className="material-textfield">
                        <input
                          type="text"
                          value={singaldocData.address}
                          className="form-control"
                          id="city"
                          name="city"
                          placeholder=" "
                        />
                        <label className="label">Address</label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLogoutModalOpen && (
        <div className="popup-container fade show">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ready to Leave?</h5>
                <button
                  className="close"
                  type="button"
                  onClick={handleLogoutCancel}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                Select Logout below if you are ready to end your current
                session.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={handleLogoutCancel}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleLogoutConfirm}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
