import React, { useState } from "react";
import {
  FaLock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserPlus,
} from "react-icons/fa";

import Login from "../Images/login.jpg";
import { Button } from "@material-ui/core";
import { translatePage } from "../Functions/Functions";
import axios from "axios";
import { toast } from "react-toastify";
import CreateInput from "../CreateInput";

const EditAccount = ({
  load,
  pageLoad,
  SimpleLoad,
  setBtnLoad,
  inputProps,
  LoginItems,
  ModalDialog,
  AdminLoginAPI,
  ChangeInputs,
  notLoginAPI,
  editData,
}) => {
  const [values, setValues] = useState({
    currentUser: "",
    currentPass: "",
    fullName: "",
    phone: "",
    email: "",
    newUser: "",
    newPass: "",
    confirmPass: "",
  });
  const {
    currentUser,
    currentPass,
    fullName,
    phone,
    email,
    newUser,
    newPass,
    confirmPass,
  } = values;

  const ResetData = () => {
    setValues({
      currentUser: "",
      currentPass: "",
      fullName: "",
      phone: "",
      email: "",
      newUser: "",
      newPass: "",
      confirmPass: "",
    });
  };

  const findUsers = () => {
    const getName = editData.find(
      (elm) => elm.partOne === currentUser && elm.partTwo === currentPass
    );

    if (getName !== undefined)
      setValues((prev) => ({
        ...prev,
        ...getName,
      }));
    else
      setValues((prev) => ({
        ...prev,
        fullName: "",
        phone: "",
        email: "",
      }));
  };

  const SubmitForm = (e) => {
    e.preventDefault();
    const getName = editData.find((elm) => elm.partOne === currentUser);

    if (getName === undefined) {
      ModalDialog.error("Failed", "Account Not Found");
    } else if (currentPass !== getName.partTwo) {
      ModalDialog.error("Failed", "Current Password is not Matching");
    } else if (newPass !== confirmPass) {
      ModalDialog.error("Failed", "New Password was not Correctly Confirmed");
    } else {
      setBtnLoad(true);
      axios
        .put(`${AdminLoginAPI}/${getName.id}`, {
          fullName: fullName,
          email: email,
          phone: Number(phone),
          partOne: newUser,
          partTwo: newPass,
          partThree: getName.partThree,
          nvigateTo: getName.nvigateTo,
        })
        .then(() => {
          axios
            .put(`${notLoginAPI}/${getName.id}`, {
              partOne: newUser,
              userCode: "No Match",
              path: "No Match",
            })
            .then(() => {
              toast.success("Account Updated Successfully");
              ResetData();
              translatePage("loginForm", "X", "editAcc", "X", "-60");
              inputProps[2]();

              setBtnLoad(false);
            })
            .catch(() => {
              setBtnLoad(false);
              ModalDialog.error("Network Error", "Can't connect to Server!");
            });
        })
        .catch(() => {
          setBtnLoad(false);
          ModalDialog.error("Network Error", "Can't connect to Server!");
        });
    }
  };

  return (
    <>
      <form
        className="editAcc"
        style={{
          transform: "translateX(-60rem)",
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
        <h2>Edit Account</h2>

        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="input_box m-0 m-lg-0">
              <CreateInput
                label="Current Username"
                type="text"
                value={currentUser}
                name="currentUser"
                onChange={(e) => ChangeInputs(e, setValues)}
                onKeyUp={findUsers}
                inputProps={inputProps}
                icon={FaUser}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="input_box m-0 mt-5 m-lg-0">
              <CreateInput
                label="Current Password"
                type="password"
                value={currentPass}
                name="currentPass"
                onChange={(e) => ChangeInputs(e, setValues)}
                onKeyUp={findUsers}
                inputProps={inputProps}
                icon={FaLock}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="input_box m-0 mt-5">
              <CreateInput
                label="Full Name"
                type="text"
                value={fullName}
                name="fullName"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaLock}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="input_box m-0 mt-5">
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

        <div className="input_box">
          <CreateInput
            label="New Username"
            type="text"
            value={newUser}
            name="newUser"
            onChange={(e) => ChangeInputs(e, setValues)}
            inputProps={inputProps}
            icon={FaUserPlus}
          />
        </div>

        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="input_box m-0 m-lg-0">
              <CreateInput
                label="New Password"
                type="password"
                value={newPass}
                name="newPass"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaLock}
              />
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="input_box m-0 mt-5 m-lg-0">
              <CreateInput
                label="Confirm Password"
                type="password"
                value={confirmPass}
                name="confirmPass"
                onChange={(e) => ChangeInputs(e, setValues)}
                inputProps={inputProps}
                icon={FaLock}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="btn mt-5" disabled={load || pageLoad}>
          {load ? (
            <>
              <span className="me-4">Updating</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "Submit"
          )}
        </Button>

        <div className="d-flex justify-content-evenly">
          <h5
            onClick={() => {
              ResetData();

              translatePage("chooseAct", "X", "editAcc", "X", "-60");
              LoginItems[1]({
                linkName: "accounts",
                info: "Please choose Account for editing",
              });
            }}
          >
            Back
          </h5>

          <h5
            onClick={() => {
              ResetData();

              translatePage("loginForm", "X", "editAcc", "X", "-60");
              inputProps[2]();
            }}
          >
            Back to Login
          </h5>
        </div>
      </form>
    </>
  );
};

export default EditAccount;
