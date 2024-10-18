import React, { useState } from "react";
import { Delete } from "@material-ui/icons";
import { Checkbox, IconButton, Tooltip, withStyles } from "@material-ui/core";
import {
  CheckBoxClick,
  FilterRow,
  SelectAllClick,
  SumNumberArray,
} from "../../Functions/Functions";
import { expensesApi } from "../../Apis";
import { MdEditDocument } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import SimpleLoad from "../../UI/SimpleLoad";

const ExpenseGrid = ({
  load,
  Data,
  filterData,
  GetOneData,
  IndexNum,
  setInputData,
  loadData,
  ModalDialog,
  setLoading,
  Total,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [itemValue, setItemValue] = useState("");
  const [itemSelected, setItemSelected] = useState([]);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const FilterRecords = FilterRow.filterBtn(
    FilterRow.searchTextBox(setAnchorEl, setItemValue)
  );
  const FilterLowerItems = FilterRow.filterRecords(
    filterData,
    itemValue,
    Data[1],
    (res) => {
      const getDesc = res.map((elm) => elm.description);
      const getAmount = res.map((elm) => elm.amount);
      Total[1]({
        descriptions: getDesc.length,
        amount: SumNumberArray(getAmount),
      });
    }
  );

  const SelectRow = (id) => {
    try {
      const data = Data[0].find((elm) => elm.id === id);
      setInputData(data);
      IndexNum[1](id);
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
              .delete(`${expensesApi}/${itemSelected[i]}`)
              .then(() => {
                const loadID = [itemSelected[i]];
                if (
                  itemSelected[itemSelected.length - 1] ===
                  loadID[loadID.length - 1]
                ) {
                  loadData(false);
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
    <div className="allGridContainer">
      <div className="position-relative px-2 pt-2 pt-lg-0">
        <h3 className="pt-3 position-absolute start-1 top-0">
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

        <h1 className="text-center">Expenses List</h1>
      </div>

      <div
        className="table-responsive mt-4 gridView"
        style={{ height: "55vh" }}
      >
        <table className="table table-hover">
          <tbody>
            {load ? (
              <>
                <tr>
                  <td colSpan={5}>
                    <div className="d-flex justify-content-center align-items-center">
                      <SimpleLoad />
                      <span className="ms-3 fw-medium">Data is Loading...</span>
                    </div>
                  </td>
                </tr>
              </>
            ) : Data[0].length === 0 ? (
              <tr>
                <td colSpan={5}>No Data Found</td>
              </tr>
            ) : (
              Data[0].map((elm, ind) => {
                const { id, date, description, amount } = elm;
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
                          onClick={() => SelectRow(id)}
                        >
                          <MdEditDocument />
                        </IconButton>
                      </div>
                    </td>

                    <td style={rowStyle}>{ind + 1}</td>
                    <td style={rowStyle}>{date}</td>
                    <td style={rowStyle}>{description}</td>
                    <td style={rowStyle}>{Number(amount).toLocaleString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>

          <thead>
            <tr>
              <th>
                <Checkbox
                  color="primary"
                  indeterminate={
                    itemSelected.length > 0 &&
                    itemSelected.length < Data[0].length
                  }
                  checked={
                    Data[0].length > 0 && itemSelected.length === Data[0].length
                  }
                  onChange={(e) =>
                    SelectAllClick(Data[0], itemSelected, setItemSelected, e)
                  }
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                  style={{ padding: "0" }}
                />
              </th>
              <th className="px-4 px-xl-0">S.No</th>
              <th className="px-4 px-xl-0">Date {FilterRecords("date")}</th>
              <th className="px-4 px-xl-0" style={{ width: "55%" }}>
                Description {FilterRecords("description")}
              </th>
              <th className="px-4 px-xl-0">
                Ammount {FilterRecords("amount")}
              </th>
            </tr>
          </thead>

          <tfoot>
            <tr>
              <th colSpan={3}>Grand Total</th>
              <th>{Total[0].descriptions}</th>
              <th>{Total[0].amount.toLocaleString()}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <FilterRow.Menu
        {...{ open, anchorEl, handleClose, itemValue }}
        filterRecord={FilterLowerItems}
      />
    </div>
  );
};

export default ExpenseGrid;
