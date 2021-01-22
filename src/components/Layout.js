import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Container, Navbar, Nav,Row,Col } from "reactstrap";
import Sidebar from "components/Sidebar.js";
import Topmenu from "components/Topmenu";
import * as Helpers from "../functions/others";

function Layout(props) {
  const user = useSelector((state) => state.user);
  return (
    <>
      <Sidebar {...props} />
      <div className="main-content bg-gradient-lighter">
        <Navbar className="navbar-dark bg-gradient-pwa p-2 d-none d-md-block">
          <Container fluid>
            <span className="h2 mb-0 text-white text-uppercase">
              {process.env.REACT_APP_TITLE}
            </span>
            <Nav className="align-items-center d-none d-md-block" navbar>
              <Topmenu />
            </Nav>
          </Container>
        </Navbar>
        <div id="content">
          <Container className={"mt-4"} fluid >
            {React.cloneElement(props.children, {
              user: user,
            })}
          </Container>
        </div>
        <footer className="py-3">
            <Container>
              <Row className="align-items-center justify-content-xl-between">
                <Col xl="12">
                  <div className="copyright text-center text-xl-center text-muted">
                    Copyright © {Helpers.Year(user.loginDate)}{" "}
                    {process.env.REACT_APP_CREATEBY}
                  </div>
                </Col>
              </Row>
            </Container>
          </footer>
      </div>
    </>
  );
}

export default Layout;
