import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";

const ShowCode = ({ inputCol, code, ChangeInputs, More }) => {
  return (
    <div className={inputCol}>
      <label className="form-label">Code:</label>
      <input
        autoComplete="off"
        type="text"
        name="code"
        value={code}
        onChange={ChangeInputs}
        className="form-control"
        required
        disabled={!More}
      />
    </div>
  );
};

const ShowType = ({
  inputCol,
  type,
  ChangeInputs,
  More,
  item,
  Options,
  delaer,
  GetItemData,
  GetDealers,
}) => {
  return (
    <>
      <div className={inputCol}>
        <label className="form-label">Type:</label>
        <select
          name="type"
          value={type}
          onChange={ChangeInputs}
          onMouseUp={
            !More && type
              ? () => {
                  GetItemData(item, "type", type);
                  GetDealers(item);
                }
              : undefined
          }
          className="form-select"
          required
          disabled={!More && item === ""}
        >
          <option value="" disabled>
            {!More && Options[0].types.length === 0
              ? "No Types Found"
              : "Choose..."}
          </option>

          {More ? (
            <>
              <option value="Afghan Land">Afghan Land</option>
              {/* <option value="Tek Delivery Service(Cargo)">
                Tek Delivery Service(Cargo)
              </option>
              <option value="Stock Market Shop">Stock Market Shop</option> */}
              <option value="Dealer">Dealer</option>
            </>
          ) : (
            Options[0].types.map((elm, i) => {
              return (
                <option key={i} value={elm}>
                  {elm}
                </option>
              );
            })
          )}
        </select>
      </div>

      {type === "Dealer" && (
        <div className={inputCol}>
          <label className="form-label">Dealer Name:</label>
          <datalist id="dealerList">
            {Options[0].purDealers.map((elm, i) => (
              <option key={i} value={elm} />
            ))}
          </datalist>

          {More ? (
            <input
              autoFocus
              autoComplete="off"
              type="search"
              name="delaer"
              value={delaer}
              list="dealerList"
              onChange={ChangeInputs}
              className="form-control"
              required
            />
          ) : (
            <select
              autoFocus
              className="form-select"
              name="delaer"
              value={delaer}
              onChange={ChangeInputs}
              onMouseUp={
                delaer !== ""
                  ? () => GetItemData(item, "delaer", delaer)
                  : undefined
              }
              required
            >
              <option value="" disabled>
                Choose...
              </option>
              {Options[0].dealers.map((elm, i) => {
                return (
                  <option key={i} value={elm}>
                    {elm}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      )}
    </>
  );
};

const InputList = ({
  ModalDialog,
  InputData,
  GetTypes,
  load,
  loadPurandSell,
  ApiName,
  loadData,
  GetItemCode,
  IndexNum,
  setLoading,
  ResetData,
  Options,
  GetItemData,
  GetDealers,
  More,
}) => {
  const inputCol = "col-11 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2";

  const {
    date,
    code,
    item,
    billNum,
    qty,
    retailPrice,
    sellPrice,
    type,
    sellType,
    commission,
    delaer,
  } = InputData[0];

  const ChangeInputs = (e) => {
    const { name, type, value } = e.target;
    InputData[1]((prev) => {
      return {
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      };
    });
  };

  useEffect(() => {
    ResetData();
  }, []);

  const SubmitForm = (e) => {
    e.preventDefault();
    const Retailtotal = qty * retailPrice;
    const Selltotal = qty * sellPrice;
    const Commission = commission * qty;

    const sendData = {
      ...InputData[0],
      commission: qty * commission,
      totalRetail: qty * retailPrice,
      total: More ? Retailtotal : Selltotal,
      profit: More ? 0 : Selltotal - Retailtotal - Commission,
      balance: More ? 0 : Selltotal - Commission,
      dealerBalance: More ? 0 : type !== "Dealer" ? 0 : Retailtotal,
      delaer: type === "Dealer" ? delaer : "",
    };

    if (IndexNum[0]) {
      setLoading(true);
      axios
        .put(`${ApiName}/${IndexNum[0]}`, sendData)
        .then(() => {
          loadData(true);
          ResetData();
          loadPurandSell(false);
          toast.success("Record Updated Successfully.");
        })
        .catch(() => {
          setLoading(false);
          ModalDialog.error("Network Error", "Can't Connect to Server!");
        });
    } else {
      setLoading(true);

      axios
        .post(ApiName, sendData)
        .then(() => {
          loadData(true);
          ResetData();
          loadPurandSell(false);
          toast.success("Record Saved Successfully.");
        })
        .catch(() => {
          setLoading(false);
          ModalDialog.error("Network Error", "Can't Connect to Server!");
        });
    }
  };

  const showTypeObj = {
    inputCol,
    type,
    ChangeInputs,
    More,
    item,
    Options,
    delaer,
    GetItemData,
    GetDealers,
  };

  return (
    <>
      <div className="col-11 col-lg-12 px-0 px-lg-5">
        <form
          className="row gy-4 gx-5 justify-content-center justify-content-sm-start"
          onSubmit={SubmitForm}
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

          {More && (
            <div className={inputCol}>
              <label className="form-label">Bill#:</label>
              <input
                autoFocus
                type="number"
                name="billNum"
                value={billNum}
                min={0}
                onChange={ChangeInputs}
                className="form-control"
                required
              />
            </div>
          )}

          <div className={inputCol}>
            <label className="form-label">Item Name:</label>

            <datalist id="itemsList">
              {Options[0].items.map((elm, i) => {
                return <option key={i} value={elm} />;
              })}
            </datalist>

            <input
              autoFocus={!More ? true : false}
              autoComplete="off"
              list="itemsList"
              type="search"
              name="item"
              value={item}
              onChange={ChangeInputs}
              onKeyUp={
                !More
                  ? () => {
                      GetTypes(item);
                      InputData[1]((prev) => ({
                        ...prev,
                        type: "",
                        delaer: "",
                        retailPrice: 0,
                        sellPrice: 0,
                      }));
                      Options[1]((prev) => ({
                        ...prev,
                        qtys: 0,
                        sellQtys: 0,
                      }));
                    }
                  : () => GetItemCode(item)
              }
              className="form-control"
              required
            />
          </div>

          {!More && (
            <div className={inputCol}>
              <label className="form-label">Sell Type:</label>
              <select
                className="form-select"
                name="sellType"
                value={sellType}
                onChange={ChangeInputs}
                required
              >
                <option value="" disabled>
                  Choose...
                </option>
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
              </select>
            </div>
          )}

          {More && <ShowCode {...{ inputCol, code, ChangeInputs, More }} />}
          {!More && <ShowType {...showTypeObj} />}
          {!More && <ShowCode {...{ inputCol, code, ChangeInputs, More }} />}

          <div className={inputCol}>
            <label className="form-label">
              QTY:
              {!More &&
                `${` | Stock: ${
                  type === "Dealer" && delaer === "" ? 0 : Options[0].qtys
                } | Sold: ${
                  type === "Dealer" && delaer === "" ? 0 : Options[0].sellQtys
                }`}`}
            </label>
            <input
              type="number"
              name="qty"
              value={qty}
              min={1}
              max={
                More
                  ? undefined
                  : IndexNum[0]
                  ? Options[0].qtys + Options[0].gridQtys
                  : Options[0].qtys
              }
              onChange={ChangeInputs}
              className="form-control"
              required
              disabled={!More && type === ""}
            />
          </div>

          {More && (
            <div className={inputCol}>
              <label className="form-label">Retail Price:</label>
              <input
                type="number"
                name="retailPrice"
                value={retailPrice}
                min={1}
                onChange={ChangeInputs}
                className="form-control"
                required
              />
            </div>
          )}

          <div className={inputCol}>
            <label className="form-label">
              Sell Price: {!More && `| Retail Price: ${type ? retailPrice : 0}`}
            </label>
            <input
              type="number"
              name="sellPrice"
              value={type !== "Dealer" || delaer || More ? sellPrice : 0}
              min={1}
              onChange={ChangeInputs}
              className="form-control"
              required
            />
          </div>

          <div className={inputCol}>
            <label className="form-label">Total:</label>
            <input
              autoComplete="off"
              type="number"
              value={More ? retailPrice * qty : sellPrice * qty}
              className="form-control"
              disabled
            />
          </div>

          {!More && (
            <>
              <div className={inputCol}>
                <div className="row">
                  <div className="col-6">
                    <label className="form-label">Each Comm:</label>

                    <input
                      type="number"
                      name="commission"
                      value={commission}
                      onChange={ChangeInputs}
                      className="form-control"
                      min={1}
                      required
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label">Total Comm:</label>

                    <input
                      type="number"
                      value={commission * qty}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className={inputCol}>
                <label className="form-label">Afghan Land Balance:</label>
                <input
                  type="number"
                  value={commission ? sellPrice * qty - commission * qty : 0}
                  onChange={ChangeInputs}
                  className="form-control"
                  disabled
                />
              </div>

              {type === "Dealer" && (
                <div className={inputCol}>
                  <label className="form-label">Dealer Balance:</label>
                  <input
                    type="number"
                    value={retailPrice * qty}
                    className="form-control"
                    disabled
                  />
                </div>
              )}

              <div className={inputCol}>
                <label className="form-label">Profit:</label>
                <input
                  type="number"
                  value={
                    qty
                      ? qty * sellPrice - qty * retailPrice - commission * qty
                      : 0
                  }
                  className="form-control"
                  required
                  disabled
                />
              </div>
            </>
          )}

          {More && <ShowType {...showTypeObj} />}

          <div className="col-12 col-xl-5 col-xxl-4">
            <div className="row gy-3 mt-0 mt-sm-4 justify-content-center justify-content-xl-start">
              <div className="col-4 col-sm-2 col-lg-2 col-xl-3">
                <Button
                  disabled={load}
                  type="submit"
                  className={`formBtn ${IndexNum[0] ? "updateBtn" : "saveBtn"}`}
                >
                  {IndexNum[0] ? "Update" : "Save"}
                </Button>
              </div>

              <div className="col-4 col-sm-2 col-lg-2 col-xl-3">
                <Button className="formBtn saveBtn" onClick={ResetData}>
                  {IndexNum[0] ? "Cancel" : "Reset"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default InputList;
