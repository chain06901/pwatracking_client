import React, { useState, useLayoutEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "../../../functions/axiosinstance";
import qs from "query-string";
import { Link, useHistory } from "react-router-dom";
import * as Helpers from "../../../functions/others";
import Datatable from "../../../lib/Datatable";
import lang from "../../../lang/th";
import {
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Table,
} from "reactstrap";

function Accept(props) {
  const dispatch = useDispatch();
  const [rows, setRows] = useState({
    count: 0,
    data: [],
  });
  const history = useHistory();
  const query = qs.parse(history.location.search);
  const [search, setSearch] = useState(query.search ? query.search : "");
  const [currentPage, setcurrentPage] = useState(
    query.page ? parseInt(query.page) : 1
  );
  const [modalUsers, setmodalUsers] = useState(false);
  const [rowsLotuser, setrowsLotuser] = useState([]);
  const [lotId, setlotId] = useState("");
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
      dataField: "totalemployee",
      text: "ผู้เกี่ยวข้อง",
    },
    {
      dataField: "acceptedAt",
      text: lang.lot.acceptedAt,
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
                {props.role === "admin" && (
                  <>
                    <DropdownItem
                      onClick={(e) => OnOpenViewlotuser(row.lot_id)}
                    >
                      <i className="fas fa-user"></i>จัดการผู้เกี่ยวข้อง
                    </DropdownItem>
                    <DropdownItem onClick={(e) => OnCancelLot(row.lot_id)}>
                      <i className="fas fa-ban"></i>ยกเลิก
                    </DropdownItem>
                  </>
                )}
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
        search: "?view=accept&page=" + page,
      });
      setcurrentPage(page);
    },
    onSearch: (e) => {
      history.push({
        search: "?view=accept&search=" + e,
      });
      setSearch(e);
    },
    page: currentPage,
  };
  const OnCancelLot = async (lot_id) => {
    Helpers.ConfirmDialog(
      "ยืนยัน ยกเลิก ?",
      "Qrcode ที่ถูกสร้างขึ้นจะไม่สามารถใช้งานได้อีก"
    ).then(async (r) => {
      dispatch({ type: "SHOW_LOADING" });
      await axios()
        .post("/actionlot", {
          lot_id: lot_id,
          status: "C",
        })
        .then((r) => {
          dispatch({ type: "HIDE_LOADING" });
          init();
        })
        .catch((e) => {});
    });
  };
  const toggle = () => {
    setmodalUsers(!modalUsers);
    document.getElementById("user_id").value = "";
  };
  const OnAdduser = async (e) => {
    let newuser = document.getElementById("user_id").value;
    if (newuser && lotId) {
      dispatch({ type: "SHOW_LOADING" });
      await axios()
        .post("/actionlotuser", {
          lot_id: lotId,
          user_id: newuser,
          type: "add",
        })
        .then((res) => {
          document.getElementById("user_id").value = "";
          OnLoaduserslot(lotId);
          init();
        });
    }
  };
  const OnDeluser = async (lot_id, user_id) => {
    await Helpers.ConfirmDialog(lang.constant.confirmdel, "").then(
      async (res) => {
        dispatch({ type: "SHOW_LOADING" });
        await axios()
          .post("/actionlotuser", {
            lot_id: lot_id,
            user_id: user_id,
            type: "del",
          })
          .then((res) => {
            OnLoaduserslot(lot_id);
          });
        await init();
      }
    );
  };
  const OnLoaduserslot = async (lot_id) => {
    dispatch({ type: "SHOW_LOADING" });
    await axios()
      .post("/lotuser", {
        lot_id: lot_id,
      })
      .then((res) => {
        setrowsLotuser(res.data);
        setlotId(lot_id);
        dispatch({ type: "HIDE_LOADING" });
      });
  };
  const OnOpenViewlotuser = async (lot_id) => {
    await OnLoaduserslot(lot_id);
    await toggle();
  };
  const init = async () => {
    dispatch({ type: "SHOW_LOADING" });
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
  }, [currentPage, search, history]);
  return (
    <>
      <Datatable
        options={options}
        rows={rows.data}
        columns={columns}
        {...props}
      />

      <Modal isOpen={modalUsers}>
        <ModalHeader toggle={toggle}>จัดการผู้เกี่ยวข้อง</ModalHeader>
        <ModalBody className="p-0">
          <Table striped size="sm">
            <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>รหัสพนักงาน</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rowsLotuser.map((row, key) => {
                return (
                  <tr>
                    <td>{key + 1}</td>
                    <td>{row.user_id}</td>
                    <td>
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={(e) => OnDeluser(row.lot_id, row.user_id)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td></td>
                <td>
                  <Input
                    bsSize="sm"
                    name="user_id"
                    id="user_id"
                    placeholder="ระบุรหัสพนักงาน"
                    type="number"
                    onInput={(e) => {
                      e.target.value = Helpers.Limitnumber(e.target.value, 7);
                    }}
                  />
                </td>
                <td>
                  <Button color="primary" size="sm" onClick={OnAdduser}>
                    <i className="fas fa-plus"></i>
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Accept;
