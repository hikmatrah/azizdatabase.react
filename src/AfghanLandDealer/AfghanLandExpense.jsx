import React, { useEffect, useState } from "react";
import NoPageFound from "../NoPageFound/NoPageFound";
import { Button } from "@material-ui/core";
import ExpenseGrid from "./Components/ExpenseGrid";
import axios from "axios";
import { toast } from "react-toastify";
import { RowStyle, SumNumberArray } from "../Functions/Functions";
import { expensesApi } from "../Apis";

const AfghanLandExpense = ({
  load,
  Login,
  ModalDialog,
  GetOneData,
  setLoading,
}) => {
  const month = new Date().toLocaleString("en-Us", { month: "2-digit" });
  const year = new Date().getFullYear();
  const day = new Date().toLocaleString("en-Us", { day: "2-digit" });
  const inputCol = "col-11 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2";
  const [indexNum, setIndexNum] = useState(null);

  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);

  const [total, setTotal] = useState({
    descriptions: 0,
    amount: 0,
  });

  const randomID = Math.random() + Math.random();
  const [inputData, setInputData] = useState({
    id: randomID.toString(),
    date: `${year}-${month}-${day}`,
    description: "",
    amount: 0,
  });
  const { date, description, amount } = inputData;

  const ChangeInputs = (e) => {
    const { name, type, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const loadData = (load) => {
    GetOneData(
      expensesApi,
      (data) => {
        const getDesc = data.map((elm) => elm.description);
        const getAmount = data.map((elm) => elm.amount);
        setData(data);
        setFilterData(data);
        setTotal({
          descriptions: getDesc.length,
          amount: SumNumberArray(getAmount),
        });
      },
      load
    );
  };

  const ResetData = () => {
    const randomID = Math.random() + Math.random();
    setInputData({
      id: randomID.toString(),
      date: `${year}-${month}-${day}`,
      description: "",
      amount: 0,
    });
    setIndexNum(null);

    RowStyle(indexNum, "", false);
  };

  useEffect(() => {
    Login[1]();
    loadData(false);
  }, []);

  const FormSubmit = (e) => {
    e.preventDefault();

    if (indexNum) {
      setLoading(true);
      axios
        .put(`${expensesApi}/${indexNum}`, inputData)
        .then(() => {
          loadData(false);
          ResetData();
          toast.success("Expense Updated Successfully.");
        })
        .catch(() => {
          setLoading(false);
          ModalDialog.error("Network Error", "Can't Connect to Server!");
        });
    } else {
      setLoading(true);
      axios
        .post(expensesApi, inputData)
        .then(() => {
          loadData(false);
          ResetData();
          toast.success("Expense Saved Successfully.");
        })
        .catch(() => {
          setLoading(false);
          ModalDialog.error("Network Error", "Can't Connect to Server!");
        });
    }
  };

  const DeleteExpense = (e) => {
    ModalDialog.success(
      "Please Confirm",
      "Would you like to Delete?",
      "Yes/No",
      () => {
        setLoading(true);
        axios
          .delete(`${expensesApi}/${indexNum}`)
          .then(() => {
            loadData(false);
            ResetData();
            toast.success("Expense Deleted Successfully.");
          })
          .catch(() => {
            setLoading(false);
            ModalDialog.error("Network Error", "Can't Connect to Server!");
          });
      }
    );
  };

  return (Login[0].userCode === Login[0].prevCode &&
    Login[0].path === "afghanAndDealer") ||
    Login[0].path === "all" ? (
    <>
      <h1 className="text-center mt-4">Afghan Land Expenses</h1>

      <div className="container-fluid mt-4 allPurchaseCon">
        <div className="row mt-5 justify-content-center mt-5">
          <div className="col-11 col-lg-12 px-0 px-lg-5">
            <form
              className="row gy-4 gx-5 justify-content-center justify-content-sm-start justify-content-xl-center"
              onSubmit={FormSubmit}
            >
              <div className={inputCol}>
                <label className="form-label">Date:</label>
                <input
                  type="date"
                  name="date"
                  value={date}
                  onChange={ChangeInputs}
                  className="form-control"
                  required
                />
              </div>

              <div className={`${inputCol} col-xxl-3`}>
                <label className="form-label">Description:</label>
                <input
                  autoFocus
                  autoComplete="off"
                  type="text"
                  name="description"
                  value={description}
                  onChange={ChangeInputs}
                  className="form-control"
                  required
                />
              </div>

              <div className={inputCol}>
                <label className="form-label">Amount:</label>
                <input
                  type="number"
                  min={1}
                  name="amount"
                  value={amount}
                  onChange={ChangeInputs}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-12 col-xl-5 col-xxl-4">
                <div className="row gy-3 mt-0 mt-sm-4 justify-content-center justify-content-xxl-start">
                  {indexNum ? (
                    <>
                      <div className="col-4 col-sm-2 col-lg-2 col-xl-3">
                        <Button type="submit" className="formBtn updateBtn">
                          Update
                        </Button>
                      </div>

                      <div className="col-4 col-sm-2 col-lg-2 col-xl-3">
                        <Button
                          className="formBtn deleteBtn"
                          onClick={DeleteExpense}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="col-4 col-sm-2 col-lg-2 col-xl-3">
                      <Button type="submit" className="formBtn saveBtn">
                        Save
                      </Button>
                    </div>
                  )}

                  <div className="col-4 col-sm-2 col-lg-2 col-xl-3">
                    <Button className="formBtn saveBtn" onClick={ResetData}>
                      {indexNum ? "Cancel" : "Reset"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-12 col-lg-11 mt-5 pt-5">
            <ExpenseGrid
              Data={[data, setData]}
              IndexNum={[indexNum, setIndexNum]}
              Total={[total, setTotal]}
              {...{
                load,
                filterData,
                GetOneData,
                setInputData,
                ModalDialog,
                loadData,
                setLoading,
              }}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default AfghanLandExpense;
