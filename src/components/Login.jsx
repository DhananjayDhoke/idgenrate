import React, { useState } from 'react';
import '../../style/css/sb-admin-2.min.css';
import axios from 'axios';
import { BASEURL } from './constant/constant';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login = () => {

  const [empCode, setEmpCode] = useState('');
  const [password, setPassword] = useState('')
  const [loginTypeField] = useState("EMPCODE")

  const navigate = useNavigate();

  const handelSubmit = async (e)=>{
    e.preventDefault();
    //console.log(empcode,password)
    try {
        const res = await axios.post(`${BASEURL}/AccountApi/LoginValidate`,{empCode,password,loginTypeField})
        if(res.data.errorCode === "1"){
          sessionStorage.setItem("sessionId",res.data.responseData.sessionId)
          sessionStorage.setItem("userId",res.data.responseData.userId)
          navigate("/dashboard")
      }else{
          //console.log("details",res.response.data.details)
          toast.error(res.data.errorDetail)
          //console.log(res)
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="bg-gradient-primary bglogin">
      <div className="container" style={{height:'100vh'}}>
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0" style={{ backgroundColor: '#dff5ff' }}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="p-5">
                      <div className="text-center">
                        <img src="/images/Logo1.png" alt="" className="logostyle" />
                      </div>
                      <form className="user" onSubmit={handelSubmit}>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control form-control-user"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                            placeholder="Employee Code"
                            onChange={(e)=>setEmpCode(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
                            onChange={(e)=>setPassword(e.target.value)}

                          />
                        </div>
                        <div className="text-center">
                          <button  className="btn btn-primary btn-user">
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
