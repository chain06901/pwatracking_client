import React, { useState, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Input,
  Row,
  Col,
  Badge,
  Label,
  CustomInput,
  PopoverBody,
  PopoverHeader,
  Popover,
} from "reactstrap";
import parse from "html-react-parser";
import { AvForm, AvField, AvInput } from "availity-reactstrap-validation";
import axios from "functions/axiosinstance";
import * as Helpers from "functions/others";
import qs from "query-string";
import lang from "lang/th";
function FormLot(props) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const ref_contract = useRef();
  const ref_main = useRef();
  const ref_id = useRef();
  const ref_file = useRef();
  const [reqContract, setreqContract] = useState(true);
  const [reqCategorys, setreqCategorys] = useState(false);
  const [loadform, setloadform] = useState({
    materials: [],
    sn: [],
    pn: [],
    components: [],
    producers: [],
  });
  const [material, setmaterial] = useState([]);
  const [delivery, setdelivery] = useState([]);
  const [catParent, setcatParent] = useState([]);
  const [catId, setcatId] = useState([]);
  const [fileError, setfileError] = useState(false);
  const [selectedFile, setselectedFile] = useState(null);
  const [title, settitle] = useState("");
  const [oldData, setoldData] = useState({});
  const [chcbox, setchcbox] = useState();
  const query = qs.parse(props.location.search);
  const m = 1;
  const [year, setyear] = useState(Helpers.Year(props.user.loginDate) - 5);
  const [popoverOpen_d, setPopoverOpen_d] = useState(false);
  const toggle_d = () => setPopoverOpen_d(!popoverOpen_d);
  const [popoverOpen_m, setPopoverOpen_m] = useState(false);
  const toggle_m = () => setPopoverOpen_m(!popoverOpen_m);
  const link = process.env.REACT_APP_BACKEND_URL +process.env.REACT_APP_FOLDER +"/report/print?token=";
  const init = async () => {
    dispatch({ type: "SHOW_LOADING" });
    await axios()
      .get("/loadform")
      .then((res) => {
        setloadform(res.data);
      })
      .catch((e) => {
        props.history.push("/");
      });
  };
  const Onview = async (lot_id) => {
    dispatch({ type: "SHOW_LOADING" });
    await axios()
      .post("/viewform", {
        lot_id: lot_id,
      })
      .then((res) => {
        dispatch({ type: "HIDE_LOADING" });
        if (res.data.error) {
          props.history.push("/");
        }
        setoldData(res.data);
        settitle(res.data.lotofproduct);
        setyear(res.data.year);
        setcatParent(loadform.categorys.filter((r) => r.parent_id === 0));
        setcatId(
          loadform.categorys.filter(
            (r) => r.parent_id == res.data.category_parent
          )
        );
        setchcbox(res.data.contract_number ? false : true);
        if (res.data.status === "C" && props.user.role === "company") {
          setreqContract(res.data.contract_number ? true : false);
          setreqCategorys(true);
        } else {
          setreqContract(false);
          setreqCategorys(false);
        }
        if (props.user.role === "admin") {
          OnCheckdelivery(
            res.data.coa_delivery,
            res.data.coa_material,
            res.data.lot_id
          );
        }
      });
  };
  const validationfile = () => {
    let value = ref_file.current.value;
    if (!value) {
      setfileError(true);
    }
  };
  const disableForm = () => {
    if (props.user.role === "company") {
      if (oldData.status === "A" || oldData.status === "W") {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };
  const OnChangeCheckbox = (e) => {
    let value = e.target.checked;
    setchcbox(value);
    setreqContract(!value);
    if (value) {
      ref_contract.current.value = "";
    }
  };
  const OnChangeCategorymain = (e) => {
    ref_id.current.value = "";
    setcatId(loadform.categorys.filter((r) => r.parent_id == e.target.value));
  };
  const OnChangeComponents = (value) => {
    if (value == 2) {
      setreqCategorys(true);
      setcatParent(loadform.categorys.filter((r) => r.parent_id === 0));
    } else {
      ref_main.current.value = "";
      ref_id.current.value = "";
      setreqCategorys(false);
      setcatParent([]);
      setcatId([]);
    }
  };
  const OnChangeFile = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024 || file.type != "application/pdf") {
        setfileError(true);
        setselectedFile(null);
      } else {
        setfileError(false);
        setselectedFile(file);
      }
    } else {
      setfileError(true);
      setselectedFile(null);
    }
  };
  const OnActionlot = (status, text) => {
    Helpers.ConfirmDialog("ยืนยัน " + text + " ?", "").then(async (r) => {
      dispatch({ type: "SHOW_LOADING" });
      await axios()
        .post("/actionlot", {
          lot_id: query.id,
          status: status,
        })
        .then((r) => {
          window.location.reload();
        })
        .catch((e) => {});
    });
  };
  const OnSubmit = (e, values) => {
    if (values.coa_file) {
      Helpers.ConfirmDialog(
        lang.constant.confirmsave,
        lang.constant.recheckdata
      ).then(async (r) => {
        dispatch({ type: "SHOW_LOADING" });
        values.coa_file = selectedFile;
        let formData = new FormData();
        Object.keys(values).forEach((key) => {
          if (key == "category_parent" || key == "category_id") {
            values[key] = values[key] ? values[key] : 0;
          }
          formData.append(key, values[key]);
        });
        if (props.routesdetail.path !== "/add") {
          let query = qs.parse(props.location.search);
          formData.append("lot_id", query.id);
        }

        await axios()
          .post("/savelot", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((r) => {
            dispatch({ type: "HIDE_LOADING" });
            Helpers.SuccessAlert(r.data).then((r) => {
              props.history.push("/");
            });
          })
          .catch((e) => {});
      });
    }
  };
  const OnCheckdelivery = async (coa_delivery, coa_material, lot_id) => {
    await axios()
      .post("/check", {
        coa_delivery: coa_delivery,
        coa_material: coa_material,
        lot_id: lot_id,
      })
      .then((res) => {
        if (res.data.coa_delivery.length) {
          setdelivery(res.data.coa_delivery);
        }
        if (res.data.coa_material.length) {
          setmaterial(res.data.coa_material);
        }
      });
  };

  useLayoutEffect(() => {
    (async () => {
      if (!loadform.sn.length) {
        await init();
      }
      if (props.routesdetail.path === "/add") {
        settitle(props.routesdetail.name);
        setoldData({ company_name: props.user.fullname });
        dispatch({ type: "HIDE_LOADING" });
      } else {
        if (loadform.sn.length) {
          await Onview(query.id);
        }
      }
    })();
  }, [loadform.sn.length]);
  return (
    <>
    {console.log(delivery)}
    {console.log(material)}
      <Row className={loading ? "d-none" : ""}>
        <Col className="order-xl-1" xl="12">
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white pt-3 pb-3">
              <Row className="align-items-center">
                <Col lg="6">
                  <h2 className="mb-0">
                    <i className={props.routesdetail.icon} /> {title}{" "}
                    {oldData.status === "W" && (
                      <>
                        <Badge className="bg-yellow text-dark">
                          <i className="fas fa-exclamation"></i>{" "}
                          {lang.constant.status[oldData.status]}
                        </Badge>
                      </>
                    )}
                    {oldData.status === "A" && (
                      <>
                        <Badge color="success">
                          <i className="fas fa-check"></i>{" "}
                          {lang.constant.status[oldData.status]}
                        </Badge>
                      </>
                    )}
                    {oldData.status === "C" && (
                      <>
                        <Badge color="danger">
                          <i className="fas fa-times"></i>{" "}
                          {lang.constant.status[oldData.status]}
                        </Badge>
                      </>
                    )}
                  </h2>
                </Col>
                <Col lg="6" className="text-right">
                  <div className="d-block d-sm-none pt-3"></div>
                  {oldData.status === "W" && props.user.role === "admin" && (
                    <>
                      <Button
                        color="danger"
                        onClick={() =>
                          OnActionlot("C", lang.constant.status["C"])
                        }
                      >
                        <i className="fas fa-times"></i>{" "}
                        {lang.constant.status["C"]}
                      </Button>
                      <Button
                        color="success"
                        onClick={() => OnActionlot("A", "ถูกต้อง")}
                      >
                        <i className="fas fa-check"></i> ยืนยันถูกต้อง
                      </Button>
                    </>
                  )}
                  {oldData.status === "A" && (
                    <>
                      <a
                        className="btn btn-default btn-sm"
                        target="_blank"
                        href={
                          link+oldData.token
                        }
                      >
                        {parse(lang.button.print)}
                      </a>
                    </>
                  )}
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <AvForm
                onValidSubmit={OnSubmit}
                beforeSubmitValidation={validationfile}
                disabled={disableForm()}
              >
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="8">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.company}
                        </label>
                        <br />
                        <Input
                          type="text"
                          defaultValue={oldData.company_name}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <div className="float-left">
                          <label className="form-control-label">
                            {lang.lot.contract}
                          </label>
                        </div>
                        <div className="float-right">
                          <Label className="form-control-label">
                            <Input
                              type="checkbox"
                              onChange={(e) => OnChangeCheckbox(e)}
                              disabled={disableForm()}
                              checked={chcbox}
                            />
                            รอเลขที่สัญญา
                          </Label>
                        </div>
                        <AvInput
                          name="contract_number"
                          type="text"
                          ref={ref_contract}
                          disabled={!reqContract}
                          required={reqContract}
                          maxLength="100"
                          value={oldData.contract_number}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <label className="form-control-label">
                    {lang.lot.pipeFittinglotNo}
                  </label>
                  <hr className="mt-1 mb-3" />
                  <Row className="px-3">
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.month}
                        </label>
                        <AvInput
                          name="month"
                          type="select"
                          required
                          value={oldData.month}
                        >
                          <option value="">เลือกเดือน</option>
                          {Array.from(new Array(12), (v, i) => (
                            <option key={i} value={m + i}>
                              {String(m + i).padStart(2, "0")}
                            </option>
                          ))}
                        </AvInput>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.year}
                        </label>
                        <AvInput
                          name="year"
                          type="select"
                          value={oldData.year}
                          required
                        >
                          <option value="">เลือกปี</option>
                          {Array.from(new Array(10), (v, i) => (
                            <option key={i} value={year + i}>
                              {" "}
                              {year + 543 + i}
                            </option>
                          ))}
                        </AvInput>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.lot_number}
                        </label>
                        <AvInput
                          name="lot_number"
                          type="text"
                          placeholder=""
                          required
                          maxLength="20"
                          value={oldData.lot_number}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <label className="form-control-label">
                    COA{" "}
                  </label>
                  <hr className="mt-1 mb-3" />
                  <Row className="px-3">
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.p_id}
                        </label>
                        <AvInput
                          name="p_id"
                          type="select"
                          required
                          value={oldData.p_id}
                        >
                          <option value="">เลือก{lang.lot.p_id}</option>
                          {loadform.producers.map((r) => (
                            <option value={r.p_id}>{r.name}</option>
                          ))}
                        </AvInput>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.coa_material} {" "}
                          {(() => {
                        if (props.user.role === "admin" && material.length) {
                          return (
                            <>
                              <Button color="warning" id="Popover2" size="sm" type="button">! {lang.lot.coa_material} ซ้ำ</Button>
                              <Popover
                                placement="right"
                                isOpen={popoverOpen_m}
                                target="Popover2"
                                toggle={toggle_m}
                              >
                                <PopoverHeader>
                                  Lot ที่ {lang.lot.coa_material} ซ้ำ
                                </PopoverHeader>
                                <PopoverBody>
                                  {material.map((value, key) => {
                                    return (
                                    <>
                                    {key +1+". "}<a href={link+value.token} target="_blank">{value.lotofproduct}</a><br/>
                                    </>
                                    );
                                  })}
                                </PopoverBody>
                              </Popover>
                            </>
                          );
                        }
                    })()}
                        </label>
                        <AvInput
                          name="coa_material"
                          type="text"
                          required
                          maxLength="20"
                          value={oldData.coa_material}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.coa_product}
                        </label>
                        <AvInput
                          name="coa_product"
                          type="text"
                          required
                          maxLength="20"
                          value={oldData.coa_product}
                        />
                      </FormGroup>
                    </Col>

                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.coa_delivery}{" "}
                          {(() => {
                      if (props.user.role === "admin" && delivery.length) {
                          return (
                            <>
                            <Button color="warning" id="Popover1" size="sm" type="button">! {lang.lot.coa_delivery} ซ้ำ</Button>
                              <Popover
                                placement="right"
                                isOpen={popoverOpen_d}
                                target="Popover1"
                                toggle={toggle_d}
                              >
                                <PopoverHeader>
                                  Lot ที่ {lang.lot.coa_delivery} ซ้ำ
                                </PopoverHeader>
                                <PopoverBody>
                                  {delivery.map((value, key) => {
                                    return (
                                      <>
                                      {key +1+". "}<a href={link+value.token} target="_blank">{value.lotofproduct}</a><br/>
                                      </>
                                      );
                                  })}
                                </PopoverBody>
                              </Popover>
                            </>
                          );
                      }
                    })()}
                        </label>
                        <AvInput
                          name="coa_delivery"
                          type="text"
                          required
                          maxLength="20"
                          value={oldData.coa_delivery}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.coa_file}
                          <small
                            className={
                              "text-muted " + (disableForm() ? "d-none" : "")
                            }
                          >
                            * PDF ไฟล์เท่านั้นและขนาดไม่เกิน 5 MB
                          </small>
                        </label>
                        {disableForm() && (
                          <>
                            <div className="my-2">
                              <a
                                className={"btn btn-sm btn-primary"}
                                target={"_blank"}
                                href={
                                  process.env.REACT_APP_BACKEND_URL +
                                  process.env.REACT_APP_FOLDER +
                                  "/report/coa?id=" +
                                  oldData.lot_id
                                }
                              >
                                <i className="fas fa-file-pdf"></i> Download PDF
                              </a>
                            </div>
                          </>
                        )}
                        {!disableForm() && (
                          <>
                            <AvInput
                              name="coa_file"
                              type="file"
                              ref={ref_file}
                              tag={CustomInput}
                              accept=".pdf"
                              invalid={fileError}
                              onChange={(e) => OnChangeFile(e)}
                            />
                          </>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <label className="form-control-label">
                    {lang.lot.detail}
                  </label>
                  <hr className="mt-1 mb-3" />
                  <Row className="px-3">
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.material}
                        </label>
                        <AvInput
                          name="material"
                          type="select"
                          required
                          value={oldData.material}
                        >
                          <option value="">เลือก {lang.lot.material}</option>
                          {loadform.materials.map((r) => (
                            <option value={r}>{r}</option>
                          ))}
                        </AvInput>
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.pressure_class}
                        </label>
                        <AvInput
                          name="pressure_class"
                          type="select"
                          required
                          value={oldData.pressure_class}
                        >
                          <option value="">
                            เลือก {lang.lot.pressure_class}
                          </option>
                          {loadform.pn.map((r) => (
                            <option value={r}>{r}</option>
                          ))}
                        </AvInput>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.component_id}
                        </label>
                        <AvInput
                          name="component_id"
                          type="select"
                          onChange={(e) => OnChangeComponents(e.target.value)}
                          required
                          value={oldData.component_id}
                        >
                          <option value="">
                            เลือก {lang.lot.component_id}
                          </option>
                          {loadform.components.map((r) => (
                            <option value={r.id}>{r.name}</option>
                          ))}
                        </AvInput>
                      </FormGroup>
                    </Col>
                    <Col lg="8">
                      <label className="form-control-label">
                        {lang.lot.categoryType}
                      </label>
                      <hr className="mt-1 mb-3" />
                      <Row className="px-3">
                        <Col>
                          <FormGroup>
                            <label className="form-control-label">
                              {lang.lot.category_parent}
                            </label>
                            <AvInput
                              name="category_parent"
                              type="select"
                              onChange={OnChangeCategorymain}
                              disabled={!reqCategorys}
                              required={reqCategorys}
                              ref={ref_main}
                              value={oldData.category_parent}
                            >
                              <option value="">
                                เลือก {lang.lot.category_parent}
                              </option>
                              {catParent.map((r) => (
                                <option value={r.c_id}>{r.name}</option>
                              ))}
                            </AvInput>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup>
                            <label className="form-control-label">
                              {lang.lot.category_id}
                            </label>
                            <AvInput
                              name="category_id"
                              type="select"
                              disabled={!reqCategorys}
                              required={reqCategorys}
                              ref={ref_id}
                              value={oldData.category_id}
                            >
                              <option value="">
                                เลือก {lang.lot.category_id}
                              </option>
                              {catId.map((r) => (
                                <option value={r.c_id}>{r.name}</option>
                              ))}
                            </AvInput>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.size_diameter}
                        </label>
                        <AvInput
                          name="size_diameter"
                          type="select"
                          required
                          value={oldData.size_diameter}
                        >
                          <option value="">
                            เลือก {lang.lot.size_diameter}
                          </option>
                          {(loadform.sn || []).map((r) => (
                            <option value={r}>{r}</option>
                          ))}
                        </AvInput>
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.weight}
                        </label>
                        <AvInput
                          name="weight"
                          type="text"
                          required
                          value={oldData.weight}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">
                          {lang.lot.amount}
                        </label>
                        <AvField
                          name="amount"
                          type="number"
                          required
                          errorMessage=" "
                          value={oldData.amount}
                          onInput={(e) => {
                            e.target.value = Helpers.Limitnumber(
                              e.target.value,
                              4
                            );
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <div className="text-center">
                  {!disableForm() && (
                    <>
                      <Button color="primary">{parse(lang.button.save)}</Button>
                    </>
                  )}
                </div>
              </AvForm>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default FormLot;
