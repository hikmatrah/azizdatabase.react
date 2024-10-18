import { CardActionArea } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ menu, setMenu, label, Icon, portTo }) => {
  const liClass = `mt-1 ${menu && "nav-item mt-lg-0"}`;
  const NavClass = `nav-link ${!menu && "dropdown-item"}`;

  return (
    <>
      <li className={liClass}>
        <CardActionArea className="w-100 NavAction">
          <NavLink
            className={NavClass}
            to={portTo}
            onClick={() => setMenu(false)}
          >
            <Icon />
            {label}
          </NavLink>
        </CardActionArea>
      </li>
    </>
  );
};

export default NavItem;
