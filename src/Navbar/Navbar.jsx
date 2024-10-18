import React, { useState } from "react";
import "./Navbar.scss";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Backdrop,
  Button,
  CardActionArea,
  makeStyles,
} from "@material-ui/core";
import {
  AddCircleOutline,
  Storefront,
  BusinessCenter,
  CardGiftcard,
  Assignment,
} from "@material-ui/icons";
import { FaSellcast } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";

import LaptopImg from "../images/laptop.gif";
import MenuIcon from "../images/menuIco.gif";
import NavItem from "./NavItem";
import MenuTitle from "./MenuTitle";
import axios from "axios";

const DropDownMenu = ({ menu, setMenu }) => {
  const menuitems = { menu, setMenu };
  return (
    <>
      <MenuTitle menu={menu} label="Expenses and Report" />
      <NavItem
        label="Afghan Land Expenses"
        Icon={BusinessCenter}
        portTo="/more/afghanLandExpense"
        {...menuitems}
      />

      <NavItem
        label="Report"
        Icon={Assignment}
        portTo="/more/report"
        {...menuitems}
      />
    </>
  );
};

const Navbar = ({ ModalDialog, navName }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);

  const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
      transition: "0.4s ease !important",
    },
  }));
  const classes = useStyles();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <Backdrop
          open={menu}
          className={classes.backdrop}
          onClick={() => setMenu(false)}
        ></Backdrop>

        <div className="container-fluid px-1 mx-1 px-lg-3 mx-lg-3 px-xl-5 mx-xl-5">
          <span className="navbar-brand">
            <img src={LaptopImg} alt="..." />
            <span className="uppercaseStyle">{navName.a}</span>
            {navName.b}
            <span className="span_style">
              <span className="uppercaseStyle">{navName.c}</span>
              {navName.d}
            </span>
          </span>

          <button
            className="navbar-toggler me-2"
            type="button"
            onClick={() => setMenu(true)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse responsiveNav navbar-collapse"
            id="navbarSupportedContent"
            style={{ left: menu ? "0" : "-320px" }}
          >
            <h3>
              <img
                src={MenuIcon}
                alt={"Icon"}
                style={{ padding: "0", margin: "0", width: "4.5rem" }}
              />
              <span>Menu</span>
            </h3>

            <div className="leftMenuItems">
              <ul className="navbar-nav ms-auto mb-2 py-2 mb-lg-0 pe-4 mt-3 mt-lg-0">
                <li className="nav-item mt-1 mt-lg-0">
                  <CardActionArea className="w-100 NavAction">
                    <NavLink
                      className="nav-link"
                      to="/afghanAndDealer/purchaseList"
                      onClick={() => setMenu(false)}
                    >
                      <Storefront />
                      Purchase List
                    </NavLink>
                  </CardActionArea>
                </li>

                <li className="nav-item mt-1 mt-lg-0">
                  <CardActionArea className="w-100 NavAction">
                    <NavLink
                      className="nav-link"
                      to="/afghanAndDealer/sellList"
                      onClick={() => setMenu(false)}
                    >
                      <FaSellcast />
                      Sell List
                    </NavLink>
                  </CardActionArea>
                </li>

                <li className="nav-item mt-1 mt-lg-0">
                  <CardActionArea className="w-100 NavAction">
                    <NavLink
                      className="nav-link"
                      to="/afghanAndDealer/stockListReport"
                      onClick={() => setMenu(false)}
                    >
                      <CardGiftcard />
                      Stock List Report
                    </NavLink>
                  </CardActionArea>
                </li>

                <MenuTitle menu={menu} label="Expenses and Report" />
                <li className="nav-item mt-1 mt-lg-0">
                  <CardActionArea className="w-100 NavAction">
                    <NavLink
                      className="nav-link"
                      to="/afghanAndDealer/afghanLandExpense"
                      onClick={() => setMenu(false)}
                    >
                      <BusinessCenter />
                      Afghan Land Expenses
                    </NavLink>
                  </CardActionArea>
                </li>

                <li className="nav-item mt-1 mt-lg-0">
                  <CardActionArea className="w-100 NavAction">
                    <NavLink
                      className="nav-link"
                      to="/afghanAndDealer/report"
                      onClick={() => setMenu(false)}
                    >
                      <Assignment />
                      Report
                    </NavLink>
                  </CardActionArea>
                </li>

                {/* {menu ? (
                  <DropDownMenu menu={menu} setMenu={setMenu} />
                ) : (
                  <li className="nav-item dropdown">
                    <CardActionArea
                      className="w-100 NavAction"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <NavLink to="/more" className="nav-link">
                        <AddCircleOutline />
                        More
                      </NavLink>
                    </CardActionArea>

                    <ul className="dropdown-menu">
                      <DropDownMenu menu={menu} setMenu={setMenu} />
                    </ul>
                  </li>
                )} */}
              </ul>
            </div>

            <div className="menuButtons">
              {/* <h4 className="menuHeader pt-3">Back to Login</h4> */}

              <Button
                className="menuBtn"
                onClick={() =>
                  ModalDialog.error(
                    "Please Confirm",
                    "Do you want to Logout?",
                    "Yes/No",
                    () => {
                      navigate("/");
                    }
                  )
                }
              >
                <BiLogOut />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
