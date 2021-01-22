import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Wait from "./View/Wait";
import Accept from "./View/Accept";
import Cancel from "./View/Cancel";
import queryString from "query-string";
import lang from "lang/th"
import { Card, Row, Col, CardBody, CardTitle } from "reactstrap";

function Dashboard(props) {
  const menu = [
    {
      view: "wait",
      name: lang.constant.status["W"],
      icon: "fas fa-exclamation",
      class: "yellow",
      status: "W",
    },
    {
      view: "accept",
      name: lang.constant.status["A"],
      icon: "fas fa-check",
      class: "green",
      status: "A",
    },
    {
      view: "cancel",
      name: lang.constant.status["C"],
      icon: "fas fa-times",
      class: "danger",
      status: "C",
    },
  ];
  const [total, setTotal] = useState([]);

  const viewpage = () => {
    var q = queryString.parse(props.location.search);
    var page = q.view;
    switch (page) {
      case "wait":
        return <Wait {...menu[0]} {...props.user} total={setTotal}/>;
      case "accept":
        return <Accept {...menu[1]} {...props.user}  total={setTotal}/>;
      case "cancel":
        return <Cancel {...menu[2]} {...props.user}  total={setTotal}/>;
      default:
        return <Redirect to="dashboard?view=wait" />;
    }
  };
  return (
    <>
      <Row>
        {menu.map((row, key) => {
          return (
            <Col lg="6" xl="4" key={key}>
              <Link to={(location) => location.pathname + "?view=" + row.view}>
                <Card className="card-stats mb-4 mb-xl-0 menudashboard">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h4"
                          className="text-uppercase text-muted mb-0"
                        >
                          {row.name}
                        </CardTitle>
                        <span className="h1 font-weight-bold mb-0">
                          {total[row.status]}
                        </span>{" "}
                        <span className="mt-3 mb-0 text-muted text-sm">
                          รายการ
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div
                          className={
                            "icon icon-shape text-white rounded-circle shadow bg-" +
                            row.class
                          }
                        >
                          <i className={row.icon}></i>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Link>
            </Col>
          );
        })}
      </Row>
      <Row className="mt-3">
        <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="shadow">{viewpage()}</Card>
        </Col>
      </Row>
    </>
  );
}
export default Dashboard;
