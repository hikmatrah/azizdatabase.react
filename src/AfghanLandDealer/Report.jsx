import React, { useEffect, useState } from "react";
import "./Styles/Report.scss";
import NoPageFound from "../NoPageFound/NoPageFound";
import { expensesApi, purchaseListApi, sellListApi } from "../Apis";
import { SumNumberArray } from "../Functions/Functions";
import ShowResult from "./Components/ShowResult";

const Report = ({ load, Login, GetOneData }) => {
  const containerCol = "col-12 col-sm-11 col-md-8 col-lg-5 col-xl-3";

  const profitStyles = {
    profit: { background: "#0063ed", color: "white" },
    lose: { background: "yellow", color: "red" },
    noProfit: { background: "transparent", color: "red" },
  };

  const [afghanLandData, setAfghanLandData] = useState({
    totalPurchases: 0,
    totalSells: 0,
    totalUnSells: 0,
    totalComm: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitPercentage: 0,
  });

  const [dealersData, setDealersData] = useState({
    totalPurchases: 0,
    totalSells: 0,
    totalUnSells: 0,
    totalComm: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitPercentage: 0,
  });

  const totalPurandDL =
    afghanLandData.totalPurchases + dealersData.totalPurchases;
  const totalComm = afghanLandData.totalComm + dealersData.totalComm;

  const totalSellandDL = afghanLandData.totalSells + dealersData.totalSells;
  const totalUnSellsandDl =
    afghanLandData.totalUnSells + dealersData.totalUnSells;
  const totalProfitSellandDL = afghanLandData.netProfit + dealersData.netProfit;
  const totalExpenses = afghanLandData.totalExpenses + totalComm;

  const totalProfit = afghanLandData.netProfit + dealersData.netProfit;

  const totalPercentage =
    totalProfitSellandDL === 0
      ? 0
      : totalProfitSellandDL < 0
      ? (totalProfitSellandDL / totalExpenses) * 100
      : (totalProfitSellandDL / totalSellandDL) * 100;

  const grandTotal = {
    totalPurchases: totalPurandDL,
    totalSells: totalSellandDL,
    totalUnSells: totalUnSellsandDl,
    totalComm: totalComm,
    totalExpenses: afghanLandData.totalExpenses,
    netProfit: totalProfit,
    profitPercentage: totalPercentage.toFixed(2),
  };

  const loadData = (filterType, load) => {
    GetOneData(
      purchaseListApi,
      (purData) => {
        const purFilter = purData.filter((elm) => elm.type === filterType);
        const getPurData = {
          purTotal: purFilter.map((elm) => elm.total),
        };
        const { purTotal } = getPurData;

        GetOneData(
          sellListApi,
          (selData) => {
            const sellFilter = selData.filter((elm) => elm.type === filterType);

            const getSellData = {
              sellTotal: sellFilter.map((elm) => elm.total),
              sellComm: sellFilter.map((elm) => elm.commission),
              sellProfit: sellFilter.map((elm) => elm.profit),
              totalRetail: sellFilter.map((elm) => elm.totalRetail),
            };
            const { sellTotal, sellComm, sellProfit, totalRetail } =
              getSellData;
            const unSells = SumNumberArray(totalRetail);

            GetOneData(
              expensesApi,
              (expenseData) => {
                const getTotalExpenses = expenseData.map((elm) => elm.amount);

                const totalExpenses =
                  filterType === "Afghan Land"
                    ? SumNumberArray(getTotalExpenses) +
                      SumNumberArray(sellComm)
                    : SumNumberArray(sellComm);

                const netPorfit =
                  filterType === "Afghan Land"
                    ? SumNumberArray(sellProfit) -
                      SumNumberArray(getTotalExpenses)
                    : SumNumberArray(sellProfit);

                const netPercenPorfit =
                  SumNumberArray(sellProfit) - totalExpenses;

                const totalPercentage =
                  netPercenPorfit === 0
                    ? 0
                    : netPercenPorfit < 0
                    ? (netPercenPorfit / totalExpenses) * 100
                    : (netPercenPorfit / SumNumberArray(sellTotal)) * 100;

                const createData = {
                  totalPurchases: SumNumberArray(purTotal),
                  totalSells: SumNumberArray(sellTotal),
                  totalUnSells: SumNumberArray(purTotal) - unSells,
                  totalComm: SumNumberArray(sellComm),
                  totalExpenses:
                    filterType === "Afghan Land"
                      ? SumNumberArray(getTotalExpenses)
                      : 0,
                  netProfit: netPorfit,
                  profitPercentage: totalPercentage.toFixed(2),
                };

                if (filterType === "Afghan Land") {
                  setAfghanLandData((prev) => ({
                    ...prev,
                    ...createData,
                  }));
                } else {
                  setDealersData((prev) => ({
                    ...prev,
                    ...createData,
                  }));
                }
              },
              load
            );
          },
          true
        );
      },
      true
    );
  };

  useEffect(() => {
    Login[1]();
    loadData("Afghan Land", true);
    loadData("Dealer", false);
  }, []);

  return (Login[0].userCode === Login[0].prevCode &&
    Login[0].path === "afghanAndDealer") ||
    Login[0].path === "all" ? (
    <>
      <h1 className="text-center mt-5">Reports</h1>
      <div className="container-fluid mt-5 pt-2">
        <div className="row gy-5 justify-content-evenly">
          <div className={containerCol}>
            <ShowResult
              load={load}
              title="Afghan Land Report"
              data={afghanLandData}
              styles={profitStyles}
              More={true}
            />
          </div>

          <div className={containerCol}>
            <ShowResult
              load={load}
              title="Dealers Report"
              data={dealersData}
              styles={profitStyles}
              More={false}
            />
          </div>

          <div className={containerCol}>
            <ShowResult
              load={load}
              title="Grand Total"
              data={grandTotal}
              styles={profitStyles}
              More={true}
            />
          </div>
        </div>
      </div>
    </>
  ) : (
    <NoPageFound loading={load} />
  );
};

export default Report;
