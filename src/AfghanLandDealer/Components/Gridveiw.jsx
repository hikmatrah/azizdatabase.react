import React, { useEffect, useState } from "react";
import "../Styles/Gridveiw.scss";
import { Checkbox, IconButton, Tooltip, withStyles } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { MdEditDocument } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CheckBoxClick,
  SelectAllClick,
  FilterRow,
} from "../../Functions/Functions";
import SimpleLoad from "../../UI/SimpleLoad";

const Gridveiw = ({
  ModalDialog,
  gridHeight,
  marginTop,
  ApiName,
  Data,
  load,
  FilterSellType,
  FilterData,
  IndexNum,
  InputData,
  total,
  ResetData,
  FilterType,
  totalShortCut,
  Options,
  GetItemData,
  GetDealers,
  loadPurandSell,
  GetTypes,
  setLoading,
  loadData,
  More,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [itemSelected, setItemSelected] = useState([]);
  const [filterGridType, setFilterGridType] = useState("All");
  const [itemValue, setItemValue] = useState("");
  const open = Boolean(anchorEl);

  useEffect(() => {
    setItemSelected([]);
  }, []);

  const DarkTooltip = withStyles(() => ({
    tooltip: {
      fontSize: 14,
      padding: "0.5rem 1.2rem",
      background: "#1a1a1a",
      color: "#fff",
    },
    arrow: {
      color: "#1a1a1a",
    },
  }))(Tooltip);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const FilterRecords = FilterRow.filterBtn(
    FilterRow.searchTextBox(setAnchorEl, setItemValue)
  );
  const FilterLowerItems = FilterRow.filterRecords(
    FilterData[0],
    itemValue,
    Data[1],
    (res) => totalShortCut(res)
  );

  const FilterGridTypes = (value) => {
    const res = FilterData[0].filter((elm) =>
      value === "All" ? elm : elm.type === value
    );
    Data[1](res);
    totalShortCut(res);
  };

  const SelectRow = (id, item, delaer, type, qty) => {
    try {
      IndexNum[1](id);

      const data = Data[0].find((elm) => elm.id === id);
      if (!More) {
        Options[1]((prev) => {
          return {
            ...prev,
            gridQtys: qty,
          };
        });

        GetTypes(item);
        GetItemData(item, "type", type);

        if (delaer !== "") {
          GetItemData(item, "delaer", delaer);
        }
        GetDealers(item);
      }

      InputData[1]({ ...data, commission: data.commission / qty });
    } catch (err) {
      console.log(err);
    }
  };

  const DeleteRows = () => {
    if (itemSelected.length === 0) {
      ModalDialog.error("Error", "Please Select a Row");
    } else {
      ModalDialog.success(
        "Please Confirm",
        "Would you like to Delete?",
        "Yes/No",
        () => {
          setLoading(true);

          for (let i = 0; i < itemSelected.length; i++) {
            axios
              .delete(`${ApiName}/${itemSelected[i]}`)
              .then(() => {
                const loadID = [itemSelected[i]];
                if (
                  itemSelected[itemSelected.length - 1] ===
                  loadID[loadID.length - 1]
                ) {
                  loadData(true);
                  ResetData();
                  loadPurandSell(false);
                  toast.success("Records Deleted Successfully.");
                }
              })
              .catch(() => {
                setLoading(false);
                ModalDialog.error("Network Error", "Can't Connect to Server!");
              });
          }
          setItemSelected([]);
        }
      );
    }
  };

  return (
    <>
      <div className={`col-12 mt-${marginTop} pt-5 pt-xl-3 allGridContainer`}>
        <div className="position-relative px-2 pt-lg-0">
          <h3
            className="position-absolute start-1 top-0"
            style={{ marginTop: "1rem" }}
          >
            Selected: {itemSelected.length}
            <DarkTooltip
              title={`${
                itemSelected.length === 0
                  ? "Select Row"
                  : itemSelected.length === 1
                  ? "Delete Row"
                  : "Delete Rows"
              }`}
              arrow
            >
              <IconButton className="deleteBtn" onClick={DeleteRows}>
                <Delete />
              </IconButton>
            </DarkTooltip>
          </h3>

          <div
            className="position-absolute end-0 top-0 d-flex justify-content-between"
            style={{ marginTop: "-2.5rem" }}
          >
            <div>
              <label className="form-label fs-4">Types:</label>
              <select
                value={filterGridType}
                onChange={(e) => {
                  setFilterGridType(e.target.value);
                  FilterGridTypes(e.target.value);
                }}
                className="form-select me-3"
                style={{ width: "13.5rem", fontSize: "1.6rem" }}
              >
                <option value="All">All</option>
                <option value="Afghan Land">Afghan Land</option>
                <option value="Dealer">Dealer</option>
              </select>
            </div>

            {!More && (
              <div>
                <label className="form-label fs-4">Sell Types:</label>
                <select
                  value={FilterType[0]}
                  onChange={(e) => {
                    FilterType[1](e.target.value);
                    setFilterGridType("All");
                    FilterSellType(e.target.value, false);
                  }}
                  className="form-select"
                  style={{ width: "9.2rem", fontSize: "1.6rem" }}
                >
                  <option value="All">All</option>
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <h1 className="text-center mt-5 pt-5 pt-md-0 mt-md-0">
          {More ? "Purchase" : "Sell"} List
        </h1>

        <div
          className="table-responsive mt-4 gridView"
          style={{ height: gridHeight }}
        >
          <table className="table table-hover">
            <tbody>
              {load ? (
                <>
                  <tr>
                    <td colSpan={15}>
                      <div className="d-flex justify-content-center align-items-center">
                        <SimpleLoad />
                        <span className="ms-3 fw-medium">
                          Data is Loading...
                        </span>
                      </div>
                    </td>
                  </tr>
                </>
              ) : Data[0].length === 0 ? (
                <tr>
                  <td colSpan={15}>No Data Found!</td>
                </tr>
              ) : (
                Data[0].map((elm, ind) => {
                  const {
                    id,
                    date,
                    code,
                    item,
                    billNum,
                    qty,
                    retailPrice,
                    sellPrice,
                    commission,
                    type,
                    total,
                    balance,
                    dealerBalance,
                    profit,
                    delaer,
                  } = elm;
                  const isItemSelected = itemSelected.indexOf(id) !== -1;

                  const rowStyle = {
                    background:
                      IndexNum[0] === id
                        ? "#daf7ff"
                        : isItemSelected
                        ? "#feebf2"
                        : "transparent",
                  };

                  return (
                    <tr key={ind}>
                      <td className="selectIcon" style={rowStyle}>
                        <div className="d-flex justify-content-evenly align-items-center mt-2">
                          <Checkbox
                            className="gridCheckBox"
                            style={{
                              padding: "0rem",
                              zoom: "120%",
                            }}
                            onClick={() =>
                              CheckBoxClick(itemSelected, setItemSelected, id)
                            }
                            checked={isItemSelected}
                            disabled={IndexNum[0] === id}
                          />

                          <IconButton
                            className="p-0"
                            disabled={isItemSelected}
                            onClick={() =>
                              SelectRow(id, item, delaer, type, qty)
                            }
                          >
                            <MdEditDocument />
                          </IconButton>
                        </div>
                      </td>
                      <td style={rowStyle}>{ind + 1}</td>
                      <td style={rowStyle}>{date}</td>
                      {More && <td style={rowStyle}>{billNum}</td>}
                      <td style={rowStyle}>{code}</td>
                      <td style={rowStyle}>{item}</td>

                      <td style={rowStyle}>{qty}</td>
                      {More && (
                        <td style={rowStyle}>
                          {Number(retailPrice).toLocaleString()}
                        </td>
                      )}
                      <td style={rowStyle}>
                        {Number(sellPrice).toLocaleString()}
                      </td>
                      <td style={rowStyle}>{Number(total).toLocaleString()}</td>
                      <td style={rowStyle}>{type}</td>
                      <td style={rowStyle}>{delaer === "" ? "N/A" : delaer}</td>
                      {!More && (
                        <td style={rowStyle}>
                          {Number(commission).toLocaleString()}
                        </td>
                      )}
                      {!More && (
                        <td style={rowStyle}>
                          {Number(balance).toLocaleString()}
                        </td>
                      )}
                      {!More && (
                        <td style={rowStyle}>
                          {Number(dealerBalance).toLocaleString()}
                        </td>
                      )}
                      {!More && (
                        <td style={rowStyle}>
                          {Number(profit).toLocaleString()}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>

            <thead>
              <tr>
                <th className="px-5 px-xl-0">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      itemSelected.length > 0 &&
                      itemSelected.length < Data[0].length
                    }
                    checked={
                      Data[0].length > 0 &&
                      itemSelected.length === Data[0].length
                    }
                    onChange={(e) => {
                      SelectAllClick(Data[0], itemSelected, setItemSelected, e);
                      IndexNum[1](null);
                      ResetData();
                    }}
                    inputProps={{
                      "aria-label": "select all desserts",
                    }}
                    style={{ padding: "0" }}
                  />
                </th>
                <th className="px-4 px-xl-0">S.No</th>
                <th className="px-4 px-xl-0">Date {FilterRecords("date")}</th>
                {More && (
                  <th className="px-4 px-xl-0">
                    Bill# {FilterRecords("billNum")}
                  </th>
                )}
                <th className="px-4 px-xl-0">Code {FilterRecords("code")}</th>
                <th className="px-4 px-xl-0">Item {FilterRecords("item")}</th>

                <th className="px-4 px-xl-0">QTY {FilterRecords("qty")}</th>
                {More && (
                  <th className="px-4 px-xl-0">
                    Retail Price {FilterRecords("retailPrice")}
                  </th>
                )}
                <th className="px-4 px-xl-0">
                  {More ? "Sell Price" : "Price"} {FilterRecords("sellPrice")}
                </th>
                <th className="px-4 px-xl-0">Total</th>

                <th className="px-4 px-xl-0">Type</th>
                <th className="px-4 px-xl-0">
                  DLR Name {FilterRecords("delaer")}
                </th>

                {!More && (
                  <>
                    <th className="px-4 px-xl-0">
                      Comm {FilterRecords("commission")}
                    </th>

                    <th className="px-4 px-xl-0">
                      AL Balance {FilterRecords("balance")}
                    </th>

                    <th className="px-4 px-xl-0">
                      DLR Balance {FilterRecords("dealerBalance")}
                    </th>

                    <th className="px-4 px-xl-0">Profit</th>
                  </>
                )}
              </tr>
            </thead>

            <tfoot>
              <tr>
                <th colSpan={More ? 5 : 4}>Grand Total</th>
                <th></th>

                <th>{load ? 0 : total.qtys}</th>

                <th colSpan={More ? 2 : 1}></th>
                <th>{load ? 0 : total.grandTotal}</th>
                {!More && <th></th>}
                <th></th>
                {More && <th></th>}

                {!More && (
                  <>
                    <th>{load ? 0 : total.commissions}</th>
                    <th>{load ? 0 : total.balances}</th>
                    <th>{load ? 0 : total.dealerBalances}</th>
                  </>
                )}

                {!More && <th>{load ? 0 : total.profits}</th>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <FilterRow.Menu
        {...{ open, anchorEl, handleClose, itemValue }}
        filterRecord={FilterLowerItems}
      />
    </>
  );
};

export default Gridveiw;
