import { IconButton, Menu } from "@material-ui/core";
import { KeyboardArrowDownRounded } from "@material-ui/icons";

export const SumNumberArray = (arr) => {
  const total = arr.reduce((cur, tot) => cur + tot, 0);
  return total;
};

export const CheckBoxClick = (state, setState, id) => {
  const selectedIndex = state.indexOf(id);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(state, id);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(state.slice(1));
  } else if (selectedIndex === state.length - 1) {
    newSelected = newSelected.concat(state.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      state.slice(0, selectedIndex),
      state.slice(selectedIndex + 1)
    );
  }
  setState(newSelected);
};

export const SelectAllClick = (data, state, setState, e) => {
  if (state.length > 0 && state.length < data.length) {
    setState([]);
  } else {
    if (e.target.checked) {
      const newSelected = data.map((n) => n.id);
      setState(newSelected);
      return;
    }
    setState([]);
  }
};

export const RowStyle = (index, id, romove, color) => {
  const Td = document.getElementsByClassName(index);
  const selectedTd = document.getElementsByClassName(id);

  for (let i = 0; i < Td.length; i++) {
    Td[i].style.background = "transparent";
  }
  if (romove) {
    for (let i = 0; i < selectedTd.length; i++) {
      selectedTd[i].style.background = color;
    }
  }
};

export const FilterRow = {
  searchTextBox: (anchorEl, state) => (item, e) => {
    anchorEl(e.currentTarget);
    setTimeout(() => {
      document.getElementById("filterRecord").focus();
    }, 100);
    state(item);
  },
  filterBtn: (state) => (name) => {
    return (
      <IconButton
        style={{ marginTop: "-5px" }}
        size="small"
        onClick={(e) => state(name, e)}
      >
        <KeyboardArrowDownRounded />
      </IconButton>
    );
  },
  filterRecords: (data, itemValue, setData, method) => (value) => {
    const res = data.filter((f) =>
      f[itemValue].toString().toLowerCase().includes(value)
    );

    setData(res);
    if (method) method(res);
  },
  Menu: ({ open, anchorEl, handleClose, itemValue, filterRecord }) => (
    <Menu
      id="long-menu"
      className="gridFilter"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={handleClose}
      style={{ height: "200px" }}
    >
      <input
        id="filterRecord"
        type={itemValue === "date" ? "date" : "search"}
        placeholder="Enter to Filter..."
        onChange={(e) => filterRecord(e.target.value)}
        style={{
          padding: "0.3rem 0.8rem",
          fontSize: "1.65em",
          outline: "none",
          margin: "0 1rem",
          border: "none",
          fontWeight: "500",
        }}
        className="FilterBox"
      />
    </Menu>
  ),
};
