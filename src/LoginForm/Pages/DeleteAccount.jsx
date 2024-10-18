import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import Login from "../Images/login.jpg";
import { Button } from "@material-ui/core";
import { translatePage } from "../Functions/Functions";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteAccount = ({
  pageLoad,
  load,
  SimpleLoad,
  inputProps,
  LoginItems,
  ModalDialog,
  AdminLoginAPI,
  notLoginAPI,
  users,
  allUsers,
  loadUsers,
  setLoading,
  setBtnLoad,
}) => {
  const [username, setUsername] = useState("");

  const SubmitForm = (e) => {
    e.preventDefault();
    const getData = allUsers.find((elm) => elm.partOne === username);

    console.log(getData.id);

    ModalDialog.success(
      "Please Confirm",
      "Would you like to Delete this Account?",
      "Yes/No",
      () => {
        axios
          .delete(`${AdminLoginAPI}/${getData.id}`)
          .then(() => {
            axios
              .delete(`${notLoginAPI}/${getData.id}`)
              .then(() => {
                setUsername("");
                loadUsers(setBtnLoad, false);
                toast.success("Account Deleted Successfully.");
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
    );
  };

  useEffect(() => {
    loadUsers(setLoading, false);
  }, []);

  return (
    <>
      <form
        className="deleteAcc"
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
        <h2>Delete Account</h2>

        <div className="input_box">
          <select
            className="input form-select shadow-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={inputProps[0]}
            onBlur={inputProps[1]}
            required
          >
            <option value="" disabled></option>
            {users.map((elm, ind) => {
              return (
                <option key={ind} value={elm.partOne}>
                  {elm.partOne}
                </option>
              );
            })}
          </select>
          <label>Account Name</label>

          <div className="i">
            <FaUser />
          </div>
        </div>

        <Button type="submit" className="btn" disabled={load || pageLoad}>
          {load ? (
            <>
              <span className="me-4">Deleting</span>
              <SimpleLoad circleColor="#fff" />
            </>
          ) : (
            "Delete Account"
          )}
        </Button>

        <div className="d-flex justify-content-evenly">
          <h5
            onClick={() => {
              translatePage("chooseAct", "X", "deleteAcc", "X", "-60");
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
              translatePage("loginForm", "X", "deleteAcc", "X", "-60");
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

export default DeleteAccount;
