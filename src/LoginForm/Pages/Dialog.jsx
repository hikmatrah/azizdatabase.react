import React, { useState } from "react";
import "../Styles/Dialog.scss";
import Button from "@material-ui/core/Button";
import { Backdrop, makeStyles } from "@material-ui/core";
import { toast } from "react-toastify";
import axios from "axios";

const Dialog = ({
  Open,
  values,
  translatePage,
  inputProps,
  notLoginAPI,
  AdminLoginAPI,
  ModalDialog,
  ResetData,
  setBtnLoad,
}) => {
  const [value, setValue] = useState("");

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      width: "100%",
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  }));
  const classes = useStyles();

  const FormSubmit = (e) => {
    e.preventDefault();
    Open[1](false);
    setBtnLoad(true);

    axios
      .post(AdminLoginAPI, {
        id: values.id,
        fullName: values.fullName,
        email: values.email,
        phone: Number(values.phone),
        partOne: values.username,
        partTwo: values.password,
        nvigateTo: value,
        partThree: "failed",
      })
      .then(() => {
        axios
          .post(notLoginAPI, {
            id: values.id,
            partOne: values.username,
            userCode: "No Match",
            path: "No Match",
          })
          .then(() => {
            ResetData();
            translatePage("loginForm", "X", "registerForm", "X", "60");
            inputProps[2]();
            setBtnLoad(false);
            toast.success("Account Added Successfully.");
          })
          .catch(() => {
            setBtnLoad(false);
            ModalDialog.error("Network Error", "Can't connect to Server");
          });
      })
      .catch(() => {
        setBtnLoad(false);
        ModalDialog.error("Network Error", "Can't connect to Server");
      });
  };

  return (
    <>
      <Backdrop open={Open[0]} className={`${classes.backdrop}`}>
        <div className="container dialogContiner">
          <form className="adminPass_dialog row pb-0" onSubmit={FormSubmit}>
            <div className="col-12">
              <h3 className="mb-3">Select Page Name</h3>

              <select
                className="form-select fs-4"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose...
                </option>
                <option value="Afghan Land & Dealer">
                  Afghan Land & Dealer
                </option>
                <option value="Stock Market Shop">Stock Market Shop</option>
                <option value="Tek Delivery Service(Cargo)">
                  Tek Delivery Service(Cargo)
                </option>
              </select>

              <div className="mt-4 d-flex justify-content-end">
                <Button onClick={() => Open[1](false)} className="dialogBtn">
                  Cancel
                </Button>
                <Button type="submit" className="dialogBtn">
                  OK
                </Button>
              </div>

              <p
                className="mb-3 text-start fs-5 mt-4"
                style={{ color: "gray" }}
              >
                Please Select Page Name for User Account
              </p>
            </div>
          </form>
        </div>
      </Backdrop>
    </>
  );
};

export default Dialog;
