import React, { useEffect } from "react";
import "./Styles/Purchase.scss";
import NoPageFound from "../NoPageFound/NoPageFound";
import Gridveiw from "./Components/Gridveiw";
import InputList from "./Components/InputList";
import { purchaseListApi } from "../Apis";

const Purchase = ({ PageProp }) => {
  const {
    loadPurandSell,
    Login,
    GetOneData,
    Data,
    FilterData,
    GetOptions,
    totalShortCut,
    load,
  } = PageProp;

  const loadData = (load) => {
    GetOneData(
      purchaseListApi,
      (data) => {
        GetOptions(load);
        Data[1](data);
        FilterData[1](data);
        totalShortCut(data);
      },
      true
    );
  };

  useEffect(() => {
    Login[1]();

    GetOptions(true);
    loadPurandSell(true);
    loadData(false);
  }, []);

  return (Login[0].prevCode === Login[0].userCode &&
    Login[0].path === "afghanAndDealer") ||
    Login[0].path === "all" ? (
    <>
      <div className="container-fluid allPurchaseCon">
        <div className="row mt-5 justify-content-center">
          <InputList
            ApiName={purchaseListApi}
            loadData={loadData}
            More={true}
            {...PageProp}
          />

          <Gridveiw
            gridHeight="calc(100vh - 330px)"
            marginTop="5"
            ApiName={purchaseListApi}
            loadData={loadData}
            More={true}
            {...PageProp}
          />
        </div>
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default Purchase;
