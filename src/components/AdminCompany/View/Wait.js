import React, { useState, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "../../../functions/axiosinstance";
import qs from "query-string";
import { Link, useHistory } from "react-router-dom";
import * as Helpers from "../../../functions/others";
import Datatable from "../../../lib/Datatable";
import lang from "../../../lang/th";

function Wait(props) {
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
      text: lang.lot.company,
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
      text: lang.lot.amount,
    },
    {
      dataField: "createdAt",
      text: lang.lot.createdAt,
      formatter: (e) => Helpers.Datetime(e),
    },
    {
      dataField: "lot_id",
      text: "",
      formatter: (value, row, rowIndex, colIndex) => {
        return (
          <>
            <Link to={"lot?id=" + value}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
              >
                <i className="far fa-file-alt"></i> รายละเอียด
              </button>
            </Link>
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
        search: "?view=wait&page=" + page,
      });
      setcurrentPage(page);
    },
    onSearch: (e) => {
      history.push({
        search: "?view=wait&search=" + e,
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
        status: props.status,
        sizePerPage: options.sizePerPage,
        currentPage: currentPage,
        search: search,
      })
      .then((res) => {
        setRows(res.data);
        props.total(res.data.total);
        dispatch({ type: "HIDE_LOADING" });
      });
  };
  useLayoutEffect(() => {
    history.listen((location) => {
      let query = qs.parse(location.search);
      setSearch(query.search ? query.search : "");
      setcurrentPage(query.page ? parseInt(query.page) : 1);
    });
    init();
  }, [currentPage, search,history]);

  return (
    <>
      <Datatable
        options={options}
        rows={rows.data}
        columns={columns}
        {...props}
      />
    </>
  );
}

export default Wait;
