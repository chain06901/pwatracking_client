import React, { useState, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "functions/axiosinstance";
import * as Helpers from "functions/others";
import lang from "lang/th"
import DatatableClient from "lib/DatatableClient";
import { Card, CardHeader, Table, Row, Col, Button } from "reactstrap";

function CompanyAll(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const [rows, setrows] = useState([]);
  const [page, setpage] = useState(1);
  const init = async () => {
    dispatch({ type: "SHOW_LOADING" });
    await axios()
      .get("/companys")
      .then((res) => {
        dispatch({ type: "HIDE_LOADING" });
        setrows(res.data);
      });
  };
  const OnDelete = (id) => {
    Helpers.ConfirmDialog(lang.constant.confirmdel, "").then(async (r) => {
      dispatch({ type: "SHOW_LOADING" });
      await axios()
        .post("/company/del", {
          id: id,
        })
        .then((r) => {
          dispatch({ type: "HIDE_LOADING" });
          init();
        })
        .catch((e) => {});
    });
  };
  useLayoutEffect(() => {
    (async () => {
      await init();
    })();
  }, []);
  const options = {
    custom: true,
    totalSize: rows.length,
    page: page,
    onPageChange: (page, sizePerPage) => {
      setpage(page);
    }
  };
  const columns = [
    {
      isDummyField: true,
      text: "#",
      formatter: (value, row, rowIndex) => {
        let key = (page - 1) * 10 + (rowIndex + 1);
        return key;
      },
    },
    {
      dataField: "name",
      text: "บริษัท",
      formatter: (value, row, rowIndex) => {
        return <b>{value}</b>;
      },
    },
    {
      dataField: "username",
      text: "Username",
    },
    {
      dataField: "contact",
      text: "ผู้ประสานงาน",
    },
    {
      dataField: "createdAt",
      text: lang.createdAt,
      formatter: (value, row, rowIndex) => {
        let date = (row.updatedAt ? row.updatedAt : row.createdAt);
        return Helpers.Datetime(date);
      },
    },
    {
      dataField: "company_id",
      text: "",
      formatter: (value, row, rowIndex, colIndex) => {
        return (
          <>
            <Link
              to={(location) =>
                location.pathname + "/edit?id=" + row.company_id
              }
            >
              <Button color="secondary" size="sm">
                <i className="fas fa-pen"></i>
              </Button>
            </Link>{" "}
            <Link onClick={(e) => OnDelete(row.company_id)}>
              <Button color="secondary" size="sm">
                <i className="fas fa-trash"></i>
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  return (
    <>
      <Row className={"mt-3 " + (loading ? "d-none" : "")}>
        <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="shadow">
            <CardHeader className="border-0">
              <Row className="align-items-center">
                <div className="col">
                  <h2 className="mb-0">{props.routesdetail.name}</h2>
                </div>
                <div className="col text-right">
                  <Link to={(location) => location.pathname + "/add"}>
                    <i className="fas fa-plus"></i> เพิ่มบริษัท
                  </Link>
                </div>
              </Row>
            </CardHeader>
            <DatatableClient columns={columns} rows={rows} options={options} primary_id={"company_id"}/>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default CompanyAll;
