import React, { useEffect, useState } from "react";
import NoPageFound from "../NoPageFound/NoPageFound";
import InputList from "./Components/InputList";
import Gridveiw from "./Components/Gridveiw";
import { sellListApi } from "../Apis";

const Sell = ({ PageProp }) => {
  const {
    purchaseData,
    loadPurandSell,
    Login,
    GetOneData,
    InputData,
    Data,
    FilterData,
    GetOptions,
    totalShortCut,
    load,
    Options,
    GetItemData,
    FilterType,
  } = PageProp;

  const loadData = async (load) => {
    GetOneData(
      sellListApi,
      (data) => {
        GetOptions(load);
        FilterSellType(FilterType[0]);
        FilterType[1](FilterType[0]);

        Data[1](data);
        FilterData[1](data);
        totalShortCut(data);
      },
      true
    );
  };

  const GetTypes = (item) => {
    const getType = purchaseData.filter((elm) => elm.item === item);
    const showType = [...new Set(getType.map((elm) => elm.type))];

    Options[1]((prev) => {
      return {
        ...prev,
        types: showType,
      };
    });
  };

  const FilterSellType = (value) => {
    GetOneData(
      sellListApi,
      (data) => {
        if (value === "All") {
          Data[1](data);
          FilterData[1](data);
          totalShortCut(data);
        } else {
          const filterData = data.filter((elm) => elm.sellType === value);
          Data[1](filterData);
          FilterData[1](filterData);
          totalShortCut(filterData);
        }
      },
      false
    );
  };

  useEffect(() => {
    Login[1]();

    loadPurandSell(true);
    GetOptions(true);
    loadData(false);
  }, []);

  return (Login[0].userCode === Login[0].prevCode &&
    Login[0].path === "afghanAndDealer") ||
    Login[0].path === "all" ? (
    <>
      <div className="container-fluid allPurchaseCon">
        <div className="row mt-5 justify-content-evenly">
          <InputList
            ApiName={sellListApi}
            More={false}
            {...{ loadData, GetTypes }}
            {...PageProp}
          />

          <Gridveiw
            gridHeight="calc(100vh - 390px)"
            marginTop="5 mt-md-3"
            ApiName={sellListApi}
            More={false}
            {...{ loadData, GetTypes, FilterType, FilterSellType }}
            {...PageProp}
          />
        </div>
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default Sell;
