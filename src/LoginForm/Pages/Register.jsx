import React, { useEffect, useState } from "react";
import Login from "../Images/login.jpg";
import { FaLock, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { Button } from "@material-ui/core";
import { translatePage } from "../Functions/Functions";
import axios from "axios";
import Dialog from "./Dialog";
import CreateInput from "../CreateInput";

const Register = ({
  pageLoad,
  load,
  SimpleLoad,
  inputProps,
  ModalDialog,
  setLoading,
  setBtnLoad,
  notLoginAPI,
  AdminLoginAPI,
  ChangeInputs,
}) => {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const randomID = Math.random() + Math.random();
  const [values, setValues] = useState({
    id: randomID.toString(),
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPass: "",
    nvigateTo: "",
  });
  const { fullName, email, phone, username, password, confirmPass } = values;

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(AdminLoginAPI);
      setData(response.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const SubmitForm = (e) => {
    e.preventDefault();
    const getUser = data.find((elm) => elm.partOne === username);

    if (getUser !== undefined) {
      ModalDialog.error(
        "Failed",
        "This Account has already Existed on this Username!"
      );
    } else if (password !== confirmPass) {
      ModalDialog.error("Failed", "Password was not Correctly Confirmed!");
    } else setDialogOpen(true);
  };

  const ResetData = () => {
    const randomID = Math.random() + Math.random();

    setValues({
      id: randomID.toString(),
      fullName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      confirmPass: "",
      nvigateTo: "",
    });
  };

  return (
    <>
      <form
        className="registerForm"
        style={{
          transform: "translateX(60rem)",
          opacity: "0",
          display: "none",
        }}
        onSubmit={SubmitForm}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Registration Form</h2>

        <div className="input_box">
          <CreateInput
            label="Full Name"
            type="text"
            value={fullName}
            name="fullName"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaUser}
          />
        </div>

        <div className="input_box">
          <CreateInput
            label="Email"
            type="email"
            value={email}
            name="email"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaEnvelope}
          />
        </div>

        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="input_box m-0 m-lg-0">
              <CreateInput
                label="Phone#"
                type="number"
                value={phone}
                name="phone"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaPhone}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="input_box m-0 mt-5 m-lg-0">
              <CreateInput
                label="Username"
                type="text"
                value={username}
                name="username"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaUser}
              />
            </div>
          </div>
        </div>

        <div className="input_box">
          <CreateInput
            label="Password"
            type="password"
            value={password}
            name="password"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaLock}
          />
        </div>

        <div className="input_box">
          <CreateInput
            label="Password"
            type="password"
            value={confirmPass}
            name="confirmPass"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaLock}
          />
        </div>

        <Button type="submit" className="btn" disabled={load || pageLoad}>
          {load ? (
            <>
              <span className="me-4">Saving</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <h5
          onClick={() => {
            translatePage("loginForm", "X", "registerForm", "X", "60");
            inputProps[2]();
            ResetData();
          }}
        >
          Back to Login
        </h5>
      </form>

      <Dialog
        {...{
          values,
          notLoginAPI,
          translatePage,
          inputProps,
          setBtnLoad,
          AdminLoginAPI,
          ModalDialog,
          ResetData,
        }}
        Open={[dialogOpen, setDialogOpen]}
      />
    </>
  );
};

export default Register;
