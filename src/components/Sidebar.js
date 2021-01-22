import React, { useState } from "react";
import { NavLink as NavLinkRRD } from "react-router-dom";
import {
  Collapse,
  NavbarBrand,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  NavItem,
  NavLink,
} from "reactstrap";
import Topmenu from "components/Topmenu";
import routes from "routes";
import { useSelector } from 'react-redux';

function Sidebar(props) {
  const user = useSelector(state => state.user);
  const [collapseOpen, setcollapseOpen] = useState(false);
  const Showmenu = (auth, closeCollapse) => {
     return routes.filter((rows) => (rows.leftmenu && rows[auth]) || (auth === "company" && rows.leftmenucompany))
     .map((row, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              to={"/" + auth + row.path}
              tag={NavLinkRRD}
              onClick={closeCollapse}
              activeClassName="active"
            >
              <i className={row.icon + " text-blue"} />
              {row.name}
            </NavLink>
          </NavItem>
        );
    });
  };
  const toggleCollapse = () => {
    setcollapseOpen(!collapseOpen);
  };
  const closeCollapse = () => {
    setcollapseOpen(false);
  };
    return (
      <Navbar
        className="navbar-vertical fixed-left navbar-light bg-white"
        expand="md"
        id="sidenav-main"
      >
        <Container fluid>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <NavbarBrand className="pt-0 d-none d-md-block">
            <img
              alt={""}
              className="navbar-brand-img"
              src={require(process.env.REACT_APP_LOGO)}
            />
          </NavbarBrand>
          <Nav className="align-items-center d-md-none">
            <Topmenu />
          </Nav>
          <Collapse navbar isOpen={collapseOpen}>
            <div className="navbar-collapse-header d-md-none">
              <Row>
                  <Col className="collapse-brand" xs="10">
                    <span className="h3 mb-0 text-uppercase">
                      {process.env.REACT_APP_TITLE}
                    </span>
                  </Col>
                <Col className="collapse-close" xs="2">
                  <button
                    className="navbar-toggler"
                    type="button"
                    onClick={toggleCollapse}
                  >
                    <span />
                    <span />
                  </button>
                </Col>
              </Row>
            </div>
            <Nav navbar>
              {Showmenu(user.role, closeCollapse)}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    );
  }
export default Sidebar;
