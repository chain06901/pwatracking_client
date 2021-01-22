import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
} from "reactstrap";
import auth from "functions/auth";
import lang from "lang/th";
import { useSelector } from "react-redux";
import ChangePass from "../lib/ModalChangepass";
import parse from "html-react-parser";
function Topmenu() {
  const [modalPassword, setmodalPassword] = useState(false);
  const user = useSelector((state) => state.user);
  return (
    <>
      <UncontrolledDropdown nav>
        <DropdownToggle className="pr-0" nav>
          <Media className="align-items-center">
            <span className="avatar avatar-sm rounded-circle">
              <img src={require("assets/img/icons/user.png")} alt="" />
            </span>
            <Media className="ml-2">
              <span className="mb-0 text-sm font-weight-bold">
                {user.fullname}
              </span>
            </Media>
          </Media>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-arrow mt-2" right>
          {user.role_id === 2 && (
            <>
              <DropdownItem onClick={(e) => setmodalPassword(true)}>
                {parse(lang.button.changepass)}
              </DropdownItem>
              <ChangePass
                option={{
                  id: user.id,
                  onOpen: modalPassword,
                  onClose: (e) => {
                    setmodalPassword(!modalPassword);
                  },
                }}
              />
            </>
          )}

          <DropdownItem onClick={auth.logout}>
            {parse(lang.button.logout)}
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  );
}

export default Topmenu;
