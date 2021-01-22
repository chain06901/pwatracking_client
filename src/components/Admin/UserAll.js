import React, { useState, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "functions/axiosinstance";
import * as Helpers from "functions/others";
import DatatableClient from "lib/DatatableClient";
import lang from "lang/th";
import { Card, CardHeader, Row, Col, Button } from "reactstrap";

function UserAll(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const [rows, setrows] = useState([]);
  const [page, setpage] = useState(1);
  const init = async () => {
    dispatch({ type: "SHOW_LOADING" });
    await axios()
      .get("/users")
      .then((res) => {
        dispatch({ type: "HIDE_LOADING" });
        setrows(res.data);
      });
  };
  const OnDelete = (id) => {
    Helpers.ConfirmDialog(lang.constant.confirmdel, "").then(async (r) => {
      dispatch({ type: "SHOW_LOADING" });
      await axios()
        .post("/user/del", {
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
    onPageChange: (page, sizePerPage) => {
      setpage(page);
    }
  };
  const columns = [
    {
      isDummyField: true,
      text: "#",
      formatter: (value, row, rowIndex) => {
        let key = rowIndex + 1;
        return key;
      },
    },
    {
      dataField: "user_id",
      text: "รหัสพนักงาน",
      formatter: (value, row, rowIndex) => {
        return <b>{value}</b>;
      },
    },
    {
      dataField: "title",
      text: "สิทธิการใช้งาน",
    },
    {
      dataField: "createdAt",
      text: lang.createdAt,
      formatter: (e) => Helpers.Datetime(e),
    },
    {
      dataField: "user_id",
      text: "",
      formatter: (value, row, rowIndex, colIndex) => {
        return (
          <>
            <Link onClick={(e) => OnDelete(row.user_id)}>
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
                    <i className="fas fa-plus"></i> เพิ่มพนักงาน
                  </Link>
                </div>
              </Row>
            </CardHeader>
            <DatatableClient columns={columns} rows={rows} primary_id={"user_id"} options={options}/>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default UserAll;
