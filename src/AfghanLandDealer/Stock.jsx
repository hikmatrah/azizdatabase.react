import React, { useState, useEffect } from "react";
import "./Styles/Stock.scss";
import StockGrid from "./Components/StockGrid";
import { SumNumberArray } from "../Functions/Functions";
import NoPageFound from "../NoPageFound/NoPageFound";
import { purchaseListApi, sellListApi } from "../Apis";

const Stock = ({ Login, GetOneData, load }) => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [sellData, setSellData] = useState([]);

  const [changeBtn, setChangeBtn] = useState("btn1");
  const [searchData, setSearchData] = useState("Afghan Land");
  const [mainData, setMainData] = useState([]);
  const [filtermainData, setFilterMainData] = useState([]);

  const [dealers, setDealers] = useState([]);

  const buttons = ["Afghan Land", "Dealers"];
  const btnStyle = {
    color: "#fff",
    background: "#427987",
  };

  const loadPurandSell = () => {
    GetOneData(
      purchaseListApi,
      (purchaseData) =>
        GetOneData(
          sellListApi,
          (sellData) => {
            const getDealers = [
              ...new Set(purchaseData.map((elm) => elm.delaer)),
            ];
            const filterDealers = getDealers.filter((elm) => elm !== "");
            setDealers(filterDealers);

            setPurchaseData(purchaseData);
            setSellData(sellData);
            loadData("type", buttons[0], purchaseData, sellData);
          },
          false
        ),
      true
    );
  };

  const loadData = (
    filterData,
    filterValue,
    purData = false,
    selData = false
  ) => {
    const filterItems = [
      ...(purData !== false ? purData : purchaseData),
    ].filter((elm) => elm[filterData] === filterValue);
    const getItems = [...new Set(filterItems.map((elm) => elm.item))];

    for (let i = 0; i < getItems.length; i++) {
      const purItems = [...(purData !== false ? purData : purchaseData)].filter(
        (elm) => elm.item === getItems[i] && elm[filterData] === filterValue
      );
      const getPurData = {
        qtys: purItems.map((elm) => elm.qty),
        code: purItems.map((elm) => elm.code),
        dealers: purItems.map((elm) => elm.delaer),
      };

      const totalPurQtys = SumNumberArray(getPurData.qtys, false);

      const sellItems = [...(selData !== false ? selData : sellData)].filter(
        (elm) => elm.item === getItems[i] && elm[filterData] === filterValue
      );
      const getSelQtys = sellItems.map((elm) => elm.qty);
      const totalSelQtys = SumNumberArray(getSelQtys, false);

      const createData = {
        code: getPurData.code[0],
        item: getItems[i],
        in: totalPurQtys,
        out: totalSelQtys,
        balance: totalPurQtys - totalSelQtys,
        dealer: getPurData.dealers,
      };

      setMainData((prev) => [...prev, createData]);
      setFilterMainData((prev) => [...prev, createData]);
    }
  };

  useEffect(() => {
    Login[1]();
    loadPurandSell();
  }, []);

  const headerBtnClick = (e, value) => {
    setChangeBtn(e.target.name);
    setSearchData(value);
    setMainData([]);
    setFilterMainData([]);

    if (value === buttons[0]) {
      loadData("type", buttons[0]);
    }
  };

  return (Login[0].userCode === Login[0].prevCode &&
    Login[0].path === "afghanAndDealer") ||
    Login[0].path === "all" ? (
    <>
      <h1 className="text-center mt-4">Stock List Report</h1>
      <div className="container-fluid mt-5 StockContainer">
        <div className="headerBtns mb-5 d-flex justify-content-start justify-content-sm-center">
          {buttons.map((elm, ind) => {
            return (
              <button
                key={ind}
                className="btn"
                style={changeBtn === `btn${ind + 1}` ? btnStyle : null}
                name={`btn${ind + 1}`}
                onClick={(e) => headerBtnClick(e, elm)}
              >
                {elm === "Dealer" ? "Dealers" : elm}
              </button>
            );
          })}

          {searchData === buttons[1] && (
            <select
              className="form-select chooseDealer"
              name="btn3"
              onChange={(e) => {
                setMainData([]);
                setFilterMainData([]);
                loadData("delaer", e.target.value);
              }}
            >
              <option value="" disabled selected>
                {dealers.length === 0 ? "No Dealer Found" : "Choose Dealer"}
              </option>

              {dealers.map((elm, i) => {
                return (
                  <option key={i} value={elm}>
                    {elm}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        <StockGrid {...{ load, mainData, filtermainData, setMainData }} />
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default Stock;
