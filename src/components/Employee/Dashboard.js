import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import qs from "query-string";
import {
  Card,
  Row,
  Col,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import * as Helpers from "functions/others";
import axios from "functions/axiosinstance";
import Datatable from "lib/Datatable";
import lang from "lang/th";

function Dashboard(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const query = qs.parse(history.location.search);
  const [search, setSearch] = useState(query.search ? query.search : "");
  const [currentPage, setcurrentPage] = useState(
    query.page ? parseInt(query.page) : 1
  );
  const [rows, setRows] = useState({
    count: 0,
    data: [],
  });
  const columns = [
    {
      isDummyField: true,
      text: "#",
      formatter: (value, row, rowIndex) => {
        let key = (currentPage - 1) * 10 + (rowIndex + 1);
        return key;
      },
    },
    {
      dataField: "company_name",
      text: "บริษัท",
      formatter: (value, row, rowIndex) => {
        return <b>{value}</b>;
      },
    },
    {
      dataField: "lotofproduct",
      text: lang.lot.pipeFittinglotNo,
    },
    {
      dataField: "amount",
      text: "จำนวนท่อ",
    },
    {
      dataField: "createdAt",
      text: "สร้างวันที่",
      formatter: (e) => Helpers.Datetime(e),
    },
    {
      dataField: "lot_id",
      text: "",
      formatter: (value, row, rowIndex, colIndex) => {
        return (
          <>
            <UncontrolledDropdown direction="up">
              <DropdownToggle
                href="#detail"
                role="button"
                size="sm"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fas fa-ellipsis-v" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow">
                <DropdownItem tag={Link} to={"lot?id=" + row.lot_id}>
                  <i className="far fa-file-alt"></i> รายละเอียด
                </DropdownItem>
                <DropdownItem
                  target={"_blank"}
                  href={
                    process.env.REACT_APP_BACKEND_URL +
                    process.env.REACT_APP_FOLDER +
                    "/report/qrcode?token=" +
                    row.token
                  }
                >
                  <i className="fas fa-qrcode"></i>Qr Code
                </DropdownItem>
                {props.role === "admin" && <></>}
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];

  const options = {
    sizePerPage: 10,
    totalSize: rows.count,
    searchValue: search,
    onTableChange: (e, { page }) => {
      setRows({
        count: 0,
        data: [],
      });
      history.push({
        search: "?page=" + page,
      });
      setcurrentPage(page);
    },
    onSearch: (e) => {
      history.push({
        search: "?search=" + e,
      });
      setSearch(e);
    },
    page: currentPage,
  };

  const init = async () => {
    dispatch({ type: "SHOW_LOADING" });
    setRows({
      count: 0,
      data: [],
    });

    await axios()
      .post("/data", {
        sizePerPage: options.sizePerPage,
        currentPage: currentPage,
        search: search,
      })
      .then((res) => {
        setRows(res.data);
        dispatch({ type: "HIDE_LOADING" });
      });
  };
  useEffect(() => {
    history.listen((location) => {
      let query = qs.parse(location.search);
      setSearch(query.search ? query.search : "");
      setcurrentPage(query.page ? parseInt(query.page) : 1);
    });
    init();
  }, [currentPage, search, history]);
  return (
    <>
      <Row className="mt-3">
        <Col className="mb-5 mb-xl-0" xl="12">
          <Card className="shadow">
            <Datatable
              options={options}
              rows={rows.data}
              columns={columns}
              {...props}
              icon={props.routesdetail.icon}
              name={props.routesdetail.name}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default Dashboard;
