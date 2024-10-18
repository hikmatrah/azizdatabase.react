import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { FaLock } from "react-icons/fa";
import Login from "../Images/login.jpg";
import { translatePage } from "../Functions/Functions";
import axios from "axios";
import CreateInput from "../CreateInput";

const AdminPassword = ({
  inputProps,
  loadUsers,
  setBtnLoad,
  loadViewUsers,
  LoginItems,
  ModalDialog,
  setLoading,
  AdminLoginAPI,
}) => {
  const [password, setPassword] = useState("");
  const [getPass, setGetPass] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(AdminLoginAPI);
      const getpassword = response.data.find(
        (elm) => elm.partThree === "success"
      );
      setGetPass(getpassword.partTwo);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      ModalDialog.error("Network Error", "Can't connect to Server");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === getPass) {
      if (LoginItems[0].linkName === "deleteAct") {
        loadUsers(setBtnLoad, false);
        translatePage("deleteAcc", "X", "adminPass", "Y", "-60");
        LoginItems[1]((prev) => ({
          ...prev,
          info: "Select account to Delete",
        }));
      } else if (LoginItems[0].linkName === "register") {
        translatePage("registerForm", "X", "adminPass", "Y", "-60");
        LoginItems[1]((prev) => ({
          ...prev,
          info: "You can create new user Account",
        }));
      } else if (LoginItems[0].linkName === "viewUsers") {
        loadViewUsers();
        document.getElementById("userBox").style.transform = "translateY(0)";
      }

      setPassword("");
    } else {
      setPassword("");
      ModalDialog.error("Error", "Invalid Admin Password");
    }
  };

  return (
    <>
      <form
        className="adminPass"
        style={{
          transform: "translateY(-60rem)",
          opacity: "0",
          display: "none",
        }}
        onSubmit={handleSubmit}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Admin Password</h2>
        <div className="input_box">
          <CreateInput
            label="Password"
            type="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            inputProps={inputProps}
            icon={FaLock}
          />
        </div>

        <Button type="submit" className="btn">
          OK
        </Button>
        <h5
          onClick={() => {
            translatePage("loginForm", "X", "adminPass", "Y", "-60");
            inputProps[2]();
          }}
        >
          Back to Login
        </h5>
      </form>
    </>
  );
};

export default AdminPassword;
