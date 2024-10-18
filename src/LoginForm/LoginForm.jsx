import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./Styles/LoginForm.scss";
import axios from "axios";

import Wave from "./Images/wave.png";
import AdminLogin from "./Pages/AdminLogin";
import Register from "./Pages/Register";
import AdminPassword from "./Pages/AdminPassword";
import ChooseAccount from "./Pages/ChooseAccount";
import EditAccount from "./Pages/EditAccount";
import DeleteAccount from "./Pages/DeleteAccount";
import Greeting from "./Pages/Greeting";
import SelectPage from "./Pages/SelectPage";
import ViewUsers from "./Pages/ViewUsers";
import { translatePage } from "./Functions/Functions";

const LoginForm = ({
  GetLogin,
  AdminLoginAPI,
  ModalDialog,
  SimpleLoad,
  notLoginAPI,
  setLogin,
  databaseCode,
}) => {
  const [data, setData] = useState([]);
  //editACT----
  const [editData, setEditData] = useState([]);

  //deleteACt---
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);

  //viewACt---
  const [viewUsers, setViewUsers] = useState([]);

  const [loginItems, setLoginItems] = useState({
    linkName: "",
    info: "to Our Database. Please Enter username and password to Login.",
  });
  const [loading, setLoading] = useState(false);
  const [btnLoad, setBtnLoad] = useState(false);

  const inputFocus = (e) => {
    const inputBox = e.target.parentElement;
    inputBox.classList.add("focus");
  };
  const inputLeave = (e) => {
    const inputBox = e.target.parentElement;
    if (e.target.value === "") inputBox.classList.remove("focus");
  };

  const backToLogin = () =>
    setLoginItems((prev) => ({
      ...prev,
      info: "to Our Database. Please Enter username and password to Login.",
    }));

  const inputProps = [inputFocus, inputLeave, backToLogin];
  const LoginItems = [loginItems, setLoginItems];

  const ChangeInputs = (e, state) => {
    const { name, value } = e.target;
    state((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const loadUsers = async (state, bool) => {
    try {
      state(true);
      const response = await axios.get(AdminLoginAPI);
      const getUsers = response.data.filter(
        (elm) => elm.partThree === "failed"
      );

      setAllUsers(response.data);
      setUsers(getUsers);
      if (bool) PasswordPage("deleteAct", "chooseAct");

      state(false);
    } catch (err) {
      state(false);
      ModalDialog.error("Network Error", "Can't connect to Server!");
    }
  };

  const loadViewUsers = async () => {
    try {
      setBtnLoad(true);
      const response = await axios.get(AdminLoginAPI);
      setViewUsers(response.data);
      setBtnLoad(false);
    } catch (error) {
      setBtnLoad(false);
      console.log(error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(notLoginAPI);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("partOne");
    sessionStorage.removeItem("partTwo");
    setLogin({ prevCode: "", userCode: "", path: "" });
    loadData();
  }, []);

  const UpdateLogin = async (code, user, path) => {
    setLoading(true);

    const filterUser = data.find((elm) => elm.partOne === user);
    if (filterUser !== undefined) {
      axios
        .put(`${notLoginAPI}/${filterUser.id}`, {
          partOne: filterUser.partOne,
          userCode: code,
          path: path,
        })
        .then(() => setLoading(false))
        .catch(() => {
          setLoading(false);
          ModalDialog.error("Network Error", "Can't Connect to Server!", "OK");
        });
    }
  };

  const PasswordPage = (linkValue, outValue) => {
    translatePage("adminPass", "Y", outValue, "X", "-60");
    LoginItems[1]({
      linkName: linkValue,
      info: "Please enter Admin current Password",
    });
  };

  const PageProp = {
    LoginItems,
    inputProps,
    pageLoad: loading,
    load: btnLoad,
    SimpleLoad,
    ModalDialog,
    setBtnLoad,
    setLoading,
    AdminLoginAPI,
    ChangeInputs,
    PasswordPage,
  };

  // Copy this code to App.js

  // import { ToastContainer } from "react-toastify";
  // import "react-toastify/dist/ReactToastify.css";

  // const [login, setLogin] = useState("");
  // const GetLogin = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await axios.get(
  //       "not_login_api"
  //     );
  //     setLogin(response.data[0].partOne);
  //     setLoading(false);
  //   } catch (error) {
  //     return console.log(error);
  //   }
  // };

  return (
    <>
      <div className="allLoginContainer">
        <div className="row justify-content-center justify-content-lg-between">
          <div className="col-md-4 col-lg-3 d-none d-lg-block">
            <img
              src={Wave}
              className="login_wave"
              alt="browser did't support this img"
            />
            <h1 className="greeting">
              <Greeting />
            </h1>

            <div className="content_container">
              <div className="content">
                <h2>Welcome</h2>
                <section>{loginItems.info}</section>
              </div>
            </div>
          </div>

          <div
            className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-7 col-xxl-6 me-0 me-xxl-5 mediaContainer"
            style={{ padding: "0 18rem" }}
          >
            <div className="login_container">
              <div className="main_container">
                <AdminLogin
                  {...{
                    GetLogin,
                    UpdateLogin,
                    databaseCode,
                    ...PageProp,
                  }}
                />

                <Register notLoginAPI={notLoginAPI} {...PageProp} />
                <AdminPassword
                  {...{ loadUsers, setBtnLoad, loadViewUsers, ...PageProp }}
                />
                <ChooseAccount {...{ setEditData, ...PageProp }} />
                <EditAccount {...{ editData, notLoginAPI, ...PageProp }} />
                <DeleteAccount
                  {...{
                    loadUsers,
                    setLoading,
                    users,
                    allUsers,
                    notLoginAPI,
                    ...PageProp,
                  }}
                />
                <SelectPage inputProps={inputProps} />
              </div>
            </div>
          </div>
        </div>

        <div className="content_media_container d-flex d-lg-none">
          <div className="content">
            <h2>Welcome</h2>
            <section>{loginItems.info}</section>

            <h1 className="greeting mediaGreet d-block d-lg-none">
              <Greeting />
            </h1>
          </div>
        </div>
      </div>

      <ViewUsers
        {...{
          Loading: [loading, setLoading],
          inputProps,
          viewUsers,
        }}
      />
    </>
  );
};

LoginForm.propTypes = {
  AdminLoginAPI: PropTypes.string.isRequired,
  ModalDialog: PropTypes.object.isRequired,
  SimpleLoad: PropTypes.func.isRequired,
};

export default LoginForm;
