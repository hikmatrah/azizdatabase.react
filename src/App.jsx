import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "odometer/themes/odometer-theme-minimal.css";

import LoginForm from "./LoginForm/LoginForm";
import axios from "axios";
import { Route, Routes, useLocation } from "react-router-dom";
import { SumNumberArray } from "./Functions/Functions";

import NoPageFound from "./NoPageFound/NoPageFound";
import LockDatabase from "./LockDatabase";
import Navbar from "./Navbar/Navbar";

import Purchase from "./AfghanLandDealer/Purchase";
import Sell from "./AfghanLandDealer/Sell";
import Stock from "./AfghanLandDealer/Stock";
import AfghanLandExpense from "./AfghanLandDealer/AfghanLandExpense";
import Report from "./AfghanLandDealer/Report";
import {
  adminLoginApi,
  notLoginApi,
  purchaseListApi,
  sellListApi,
} from "./Apis";
import SimpleLoad from "./UI/SimpleLoad";

const App = ({ ModalDialog }) => {
  const location = useLocation();

  const [showDatabase, setShowDatabase] = useState(true);
  const databaseCode = "*#$lockdatabase$#*";
  const [login, setLogin] = useState({
    prevCode: "",
    userCode: "",
    path: "",
  });

  const [loading, setLoading] = useState(false);

  const [purchaseData, setPurchaseData] = useState([]);
  const [sellData, setSellData] = useState([]);
  const [filterType, setFilterType] = useState("All");

  // Purchase and Sell start --------------------------------------
  const month = new Date().toLocaleString("en-Us", { month: "2-digit" });
  const year = new Date().getFullYear();
  const day = new Date().toLocaleString("en-Us", { day: "2-digit" });

  const randomID = Math.random() + Math.random();

  const [inputData, setInputData] = useState({
    id: randomID.toString(),
    date: `${year}-${month}-${day}`,
    code: "",
    item: "",
    billNum: "",
    qty: 0,
    retailPrice: 0,
    sellPrice: 0,
    sellType: "",
    commission: 0,
    type: "",
    total: 0,
    delaer: "",
  });

  const [total, setTotal] = useState({
    items: 0,
    qtys: 0,
    retailPrices: 0,
    sellPrices: 0,
    grandTotal: 0,
    commission: 0,
    balances: 0,
    dealerBalances: 0,
    profit: 0,
    delaers: 0,
  });
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [indexNum, setIndexNum] = useState(null);

  const [options, setOptions] = useState({
    items: [],
    dealers: [],
    types: [],
    gridQtys: 0,
    qtys: 0,
    sellQtys: 0,
  });

  const GetOneData = async (url, method, load) => {
    try {
      setLoading(true);

      const response = await axios.get(url);
      method(response.data);

      setLoading(load);
    } catch (err) {
      setLoading(false);
      ModalDialog.error("Network Error", "Can't Connect to Server!", "OK");
      console.log(err);
    }
  };

  const totalShortCut = (data) => {
    const getTotal = {
      qty: data.map((elm) => elm.qty),
      retailPrice: data.map((elm) => elm.retailPrice),
      sellPrice: data.map((elm) => elm.sellPrice),
      commission: data.map((elm) => elm.commission),
      total: data.map((elm) => elm.total),
      profit: data.map((elm) => elm.profit),
      balance: data.map((elm) => elm.balance),
      dealerBalance: data.map((elm) => elm.dealerBalance),
      delaers: data.map((elm) => elm.delaer),
    };

    setTotal({
      qtys: SumNumberArray(getTotal.qty).toLocaleString(),
      retailPrices: SumNumberArray(
        getTotal.retailPrice,
        false
      ).toLocaleString(),
      commissions: SumNumberArray(getTotal.commission).toLocaleString(),
      grandTotal: SumNumberArray(getTotal.total).toLocaleString(),
      profits: SumNumberArray(getTotal.profit).toLocaleString(),
      balances: SumNumberArray(getTotal.balance).toLocaleString(),
      dealerBalances: SumNumberArray(
        getTotal.dealerBalance,
        false
      ).toLocaleString(),
      delaers: getTotal.delaers.filter((elm) => elm !== "").length,
    });
  };

  const GetItemCode = (item) => {
    const getItem = purchaseData.filter((elm) => elm.item === item);
    const getCode = getItem.map((elm) => elm.code);
    setInputData((prev) => ({ ...prev, code: getCode[0] ? getCode[0] : "" }));
  };

  const GetItemData = (filterName, filterType, type) => {
    const getItemData = purchaseData.filter(
      (elm) => elm.item === filterName && elm[filterType] === type
    );

    //Purchase Filter
    const code = getItemData.map((elm) => elm.code);
    const retailPrice = getItemData.map((elm) => elm.retailPrice);
    const sellPirce = getItemData.map((elm) => elm.sellPrice);
    const getQtys = getItemData.map((elm) => elm.qty);

    //Sell Filter
    const getItemData2 = sellData.filter(
      (elm) => elm.item === filterName && elm[filterType] === type
    );
    const getQtys2 = getItemData2.map((elm) => elm.qty);

    setOptions((prev) => {
      return {
        ...prev,
        qtys: SumNumberArray(getQtys, false) - SumNumberArray(getQtys2, false),
        sellQtys: SumNumberArray(getQtys2, false),
      };
    });

    setInputData((prev) => {
      return {
        ...prev,
        code: code[0],
        retailPrice: retailPrice[0],
        sellPrice: Math.max(...sellPirce),
      };
    });
  };

  const ResetData = () => {
    const randomID = Math.random() + Math.random();

    setInputData((prev) => {
      return {
        ...prev,
        id: randomID.toString(),
        date: `${year}-${month}-${day}`,
        code: "",
        item: "",
        billNum: "",
        retailPrice: 0,
        sellPrice: 0,
        sellType: "",
        commission: 0,
        qty: 0,
        type: "",
        total: 0,
        delaer: "",
      };
    });
    setIndexNum(null);

    setOptions((prev) => {
      return {
        ...prev,
        qtys: 0,
        sellQtys: 0,
      };
    });
  };

  const GetOptions = (load) => {
    GetOneData(
      purchaseListApi,
      (data) => {
        const getItems = [...new Set(data.map((elm) => elm.item))];
        const getDealers = data.map((elm) => elm.delaer);
        const getMainDealer = getDealers.filter((elm) => elm !== "");

        setOptions((prev) => ({
          ...prev,
          items: getItems,
          purDealers: getMainDealer,
        }));
      },
      load
    );
  };

  const GetDealers = (item) => {
    const getMainDealers = purchaseData.filter((elm) => elm.item === item);
    const getdealers = [...new Set(getMainDealers.map((elm) => elm.delaer))];
    const getDealer = getdealers.filter((elm) => elm !== "");

    setOptions((prev) => ({
      ...prev,
      dealers: getDealer,
    }));
  };

  // Purchase and Sell end --------------------------------------

  const loadPurandSell = (load) => {
    GetOneData(
      purchaseListApi,
      (purchaseData) =>
        GetOneData(
          sellListApi,
          (sellData) => {
            setPurchaseData(purchaseData);
            setSellData(sellData);
          },
          load
        ),
      true
    );
  };

  const GetLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.get(notLoginApi);

      const getUser = sessionStorage.getItem("partOne");
      const getCode = sessionStorage.getItem("partTwo");
      const filterUser = response.data.find((elm) => elm.partOne === getUser);

      setLogin({
        prevCode: Number(getCode),
        userCode: filterUser.userCode,
        path: filterUser.path,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  const loadData = async () => {
    try {
      setLoading(true);
      const respnose = await axios.get(notLoginApi);
      setShowDatabase(respnose.data[0].database);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const essentialProp = {
    load: loading,
    setLoading,
    Login: [login, GetLogin],
    GetOneData,
  };

  const PageProp = {
    ModalDialog,
    purchaseData,
    sellData,
    GetOptions,
    loadPurandSell,
    Data: [data, setData],
    FilterData: [filterData, setFilterData],
    IndexNum: [indexNum, setIndexNum],
    InputData: [inputData, setInputData],
    total,
    ResetData,
    totalShortCut,
    GetItemCode,
    Options: [options, setOptions],
    GetItemData,
    GetDealers,
    FilterType: [filterType, setFilterType],
    ...essentialProp,
  };

  return (
    <>
      {location.pathname !== "/" && location.pathname !== "/selectPage" && (
        <Navbar
          ModalDialog={ModalDialog}
          navName={
            location.pathname.includes("/afghanAndDealer/")
              ? {
                  a: "A",
                  b: "fghanland &",
                  c: " D",
                  d: "ealer",
                }
              : {}
          }
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            showDatabase ? (
              <LoginForm
                AdminLoginAPI={adminLoginApi}
                notLoginAPI={notLoginApi}
                {...{ setLogin, SimpleLoad, ModalDialog, databaseCode }}
              />
            ) : (
              <LockDatabase {...{ setLoading, ModalDialog, databaseCode }} />
            )
          }
        />

        <Route
          path="/afghanAndDealer/purchaseList"
          element={<Purchase PageProp={PageProp} />}
        />
        <Route
          path="/afghanAndDealer/sellList"
          element={<Sell PageProp={PageProp} />}
        />
        <Route
          path="/afghanAndDealer/stockListReport"
          element={
            <Stock
              loadPurandSell={loadPurandSell}
              PurAndSell={[purchaseData, sellData]}
              {...essentialProp}
            />
          }
        />
        <Route
          path="/afghanAndDealer/afghanLandExpense"
          element={
            <AfghanLandExpense
              {...{ ModalDialog, setLoading }}
              {...essentialProp}
            />
          }
        />
        <Route
          path="/afghanAndDealer/report"
          element={<Report {...essentialProp} />}
        />

        <Route path="*" element={<NoPageFound loading={false} />} />
      </Routes>

      <ToastContainer
        position="top-center"
        style={{ fontSize: "1.5rem" }}
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
};

export default App;
