import React, { useEffect, useState } from "react";
import "./LockDatabase.scss";
import lock from "./images/lock.gif";
import { notLoginApi } from "./Apis";
import axios from "axios";

const LockDatabase = ({ setLoading, ModalDialog, databaseCode }) => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(notLoginApi);
      setMessage(response.data[0].message);
      setError(
        "This Database has been Locked. If you want to unlock this Database please read the below message!"
      );

      setLoading(false);
    } catch (err) {
      setLoading(false);
      ModalDialog.error("Network Error", "Can't Connect to Server!", "OK");
      setError("Sorry! Can't Connect to Server!");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const lockDatabase = () => {
    if (window.confirm("Would you like to unlock this Database?")) {
      const msg = prompt("Enter the Code to Unlock");
      if (msg === databaseCode) {
        if (error === "Sorry! Can't Connect to Server!")
          alert("Can't Connect to Server");
        else {
          setLoading(true);
          axios
            .put(`${notLoginApi}/10203040`, {
              database: true,
              message: "",
            })
            .then(() => {
              ModalDialog.success("Locked", "Database has been Unlocked.");
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
      } else {
        alert("You have entered wrong Code. Try again!");
      }
    }
  };

  return (
    <>
      <div className="container-fluid text-center pt-5 lockDatabse">
        <h1 className="text-danger mt-5">{error}</h1>

        <img
          src={lock}
          className="img-fluid"
          alt="Browser Can't Support this img."
          width={180}
        />

        <h1 className="text-light mt-5 mb-5">{message}</h1>

        <img
          src="logo512.png"
          className="img-fluid mt-5 reactLogo"
          alt="Browser Can't Support this img."
          width={180}
        />
        <h2 className="text-light mt-3" onClick={lockDatabase}>
          React
        </h2>
      </div>
    </>
  );
};

export default LockDatabase;
