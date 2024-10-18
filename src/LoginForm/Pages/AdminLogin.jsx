import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import Login from "../Images/login.jpg";
import { Button } from "@material-ui/core";
import { translatePage } from "../Functions/Functions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { adminLoginApi, notLoginApi } from "../../Apis";
import CreateInput from "../CreateInput";

const AdminLogin = ({
  SimpleLoad,
  load,
  pageLoad,
  inputProps,
  LoginItems,
  ModalDialog,
  setLoading,
  setBtnLoad,
  AdminLoginAPI,
  ChangeInputs,
  UpdateLogin,
  databaseCode,
  PasswordPage,
}) => {
  const navigate = useNavigate();
  const [loginValues, setLoginValues] = useState({
    username: "",
    password: "",
  });
  const { username, password } = loginValues;

  const getPassword = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${adminLoginApi}/1`);
      alert(`Username: ${res.data.partOne} \n Password: ${res.data.partTwo}`);
      setLoginValues({ username: "", password: "" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const lockDatabase = () => {
    if (window.confirm("Would you like to Lock this Database?")) {
      const msg = prompt("Enter your message");
      if (msg !== null) {
        setLoading(true);
        axios
          .put(`${notLoginApi}/10203040`, {
            database: false,
            message: msg,
          })
          .then(() => {
            ModalDialog.success("Locked", "Database has been Locked.");
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    }
  };

  const url = `${AdminLoginAPI}?partOne=${username}&partTwo=${password}`;
  const GetData = async () => {
    try {
      setBtnLoad(true);
      const response = await axios.get(url);
      const data = response.data;
      if (data.length > 0) {
        axios
          .get(url)
          .then((res) => {
            const data = res.data[0];
            if (username === data.partOne && password === data.partTwo) {
              const code = Math.random() + Math.random();
              sessionStorage.setItem("partOne", username);
              sessionStorage.setItem("partTwo", code);

              if (data.nvigateTo === "Afghan Land & Dealer") {
                UpdateLogin(code, username, "afghanAndDealer");
                navigate("/afghanAndDealer/purchaseList");
              } else if (data.nvigateTo === "Stock Market Shop") {
                UpdateLogin(code, username, "stockMarket");
                navigate("/stockMarket/");
              } else if (data.nvigateTo === "Tek Delivery Service(Cargo)") {
                UpdateLogin(code, username, "deliveryCargo");
                navigate("/deliveryCargo/");
              } else if (data.nvigateTo === "all") {
                translatePage("selectPage", "Y", "loginForm", "X", "-60");
              } else navigate("/");

              setLoginValues({ username: "", password: "" });
              setBtnLoad(false);
            } else {
              ModalDialog.error(
                "Login Failed",
                "Wrong Username or Password",
                "OK"
              );
              setBtnLoad(false);
            }
          })
          .catch((err) => console.log(err));
      } else {
        ModalDialog.error("Login Failed", "Wrong Username or Password!", "OK");
        setBtnLoad(false);
      }
    } catch (err) {
      setBtnLoad(false);
      ModalDialog.error("Network Error", "Can't connect to Server!", "OK");
    }
  };

  const SubmitForm = (e) => {
    e.preventDefault();
    GetData();
  };

  return (
    <>
      <form
        className="loginForm"
        style={{
          transform: "translateX(0rem)",
          opacity: "1",
          display: "block",
        }}
        onSubmit={SubmitForm}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Login</h2>

        <div className="input_box">
          <CreateInput
            label="Username"
            type="text"
            value={username}
            name="username"
            onChange={(e) => ChangeInputs(e, setLoginValues)}
            inputProps={inputProps}
            icon={FaUser}
          />
        </div>

        <div className="input_box">
          <CreateInput
            label="Password"
            type="password"
            value={password}
            name="password"
            onChange={(e) => {
              ChangeInputs(e, setLoginValues);
              if (e.target.value === "*(showmyaccount)") getPassword();
              else if (e.target.value === databaseCode) lockDatabase();
            }}
            inputProps={inputProps}
            icon={FaLock}
          />
        </div>

        <Button type="submit" className="btn" disabled={load || pageLoad}>
          {load ? (
            <>
              <span className="me-4">Signing</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "Login"
          )}
        </Button>

        <div className="row justify-content-evenly">
          <div className="col-4 col-sm-3">
            <h5
              onClick={() => {
                translatePage("chooseAct", "X", "loginForm", "X", "-60");
                LoginItems[1]({
                  linkName: "accounts",
                  info: "Choose Account for Editing",
                });
              }}
            >
              Accounts
            </h5>
          </div>

          <div className="col-6 col-sm-5">
            <h5 onClick={() => PasswordPage("register", "loginForm")}>
              New Registration
            </h5>
          </div>

          <div className="col-4 col-sm-3">
            <h5 onClick={() => PasswordPage("viewUsers", "loginForm")}>
              View Users
            </h5>
          </div>
        </div>
      </form>
    </>
  );
};

export default AdminLogin;
