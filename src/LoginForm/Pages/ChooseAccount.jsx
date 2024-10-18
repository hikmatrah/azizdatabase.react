import React from "react";
import { Button } from "@material-ui/core";
import Login from "../Images/login.jpg";
import { translatePage } from "../Functions/Functions";
import axios from "axios";

const ChooseAccount = ({
  inputProps,
  LoginItems,
  ModalDialog,
  setLoading,
  AdminLoginAPI,
  setEditData,
  PasswordPage,
}) => {
  const EditClick = async () => {
    try {
      setLoading(true);
      const response = await axios.get(AdminLoginAPI);
      setEditData(response.data);

      translatePage("editAcc", "X", "chooseAct", "X", "60");
      LoginItems[1]((prev) => ({
        ...prev,
        info: "You can change your Account with your current Username and Password",
      }));

      setLoading(false);
    } catch (err) {
      setLoading(false);
      ModalDialog.error("Network Error", "Can't connect to Server!");
    }
  };

  const DeleteClick = () => PasswordPage("deleteAct", "chooseAct");

  return (
    <>
      <form
        className="chooseAct"
        style={{
          transform: "translateX(60rem)",
          opacity: "0",
          display: "none",
        }}
      >
        <img
          className="avatar"
          src={Login}
          alt="browser did't support this img"
        />
        <h2>Choose Account</h2>

        <Button className="btn" onClick={EditClick}>
          Edit Account
        </Button>
        <Button className="btn" onClick={DeleteClick}>
          Delete Account
        </Button>

        <h5
          onClick={() => {
            translatePage("loginForm", "X", "chooseAct", "X", "60");
            inputProps[2]();
          }}
        >
          Back to Login
        </h5>
      </form>
    </>
  );
};

export default ChooseAccount;
