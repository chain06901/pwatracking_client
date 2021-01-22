import React, { useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "functions/axiosinstance";
import qs from "query-string";
import * as Helpers from "functions/others";
import ChangePass from "lib/ModalChangepass";
import lang from "lang/th"
import { useHistory } from "react-router-dom";
import { AvForm, AvInput, AvField } from "availity-reactstrap-validation";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Row,
  Col,
} from "reactstrap";
import parse from "html-react-parser";
function CompanyForm(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [oldData, setoldData] = useState([]);
  const loading = useSelector((state) => state.loading);
  const [modalPassword, setmodalPassword] = useState(false);
  const query = qs.parse(history.location.search);
  const id = query.id ? query.id : "";
  const title = query.id ? "แก้ไขบริษัท" : "เพิ่มบริษัท";
  const OnSubmit = (e, data) => {
    Helpers.ConfirmDialog(
      lang.constant.confirmsave,
      lang.constant.recheckdata
    ).then(async (r) => {
      dispatch({ type: "SHOW_LOADING" });
      await axios()
        .post("/company/save", {
          id: id,
          data,
        })
        .then((res) => {
          if (res.data.status != 401) {
            dispatch({ type: "HIDE_LOADING" });
            Helpers.SuccessAlert(res.data).then((e) => {
              let user = Helpers.decode_payload();
              history.push("/" + user.role + "/companys");
            });
          }
        });
    });
  };
  const loadId = async (id) => {
    dispatch({ type: "SHOW_LOADING" });
    await axios()
      .get("/company/" + id)
      .then((res) => {
        dispatch({ type: "HIDE_LOADING" });
        setoldData(res.data);
      });
  };
  const optionsModal = {
    id: id,
    onOpen: modalPassword,
    onClose: (e) => {
      setmodalPassword(!modalPassword);
    },
  };
  useLayoutEffect(() => {
    if (id) {
      loadId(id);
    }
  }, []);
  return (
    <>
      <Row className={loading ? "d-none" : ""}>
        <Col className="order-xl-1" xl="12">
          <Card className="bg-secondary shadow">
            <CardHeader className="bg-white border-0">
              <Row className="align-items-center">
                <Col xs="8">
                  <h2 className="mb-0">{title}</h2>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              <AvForm onValidSubmit={OnSubmit}>
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="8">
                      <FormGroup>
                        <label className="form-control-label">บริษัท</label>
                        <AvInput
                          name="name"
                          type="text"
                          required
                          value={oldData.name}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">ตัวย่อ</label>
                        <AvInput
                          name="shortname"
                          type="text"
                          required
                          maxLength="10"
                          value={oldData.shortname}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <label className="form-control-label">ที่อยู่</label>
                        <AvInput
                          name="address"
                          type="textarea"
                          required
                          maxLength="200"
                          value={oldData.address}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          ผู้ประสานงาน
                        </label>
                        <AvInput
                          name="contact"
                          type="text"
                          required
                          maxLength="100"
                          value={oldData.contact}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label className="form-control-label">
                          เบอร์โทรศัพท์
                        </label>
                        <AvInput
                          name="phone"
                          type="phone"
                          required
                          maxLength="50"
                          value={oldData.phone}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </div>
                <hr className="my-4" />
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">Username</label>
                        <AvField
                          name="username"
                          type="text"
                          required
                          maxLength="50"
                          validate={{
                            required: { value: true, errorMessage: " " },
                            minLength: {
                              value: lang.validation.minchar,
                              errorMessage:
                              lang.validation.error.minchar,
                            },
                          }}
                          value={oldData.username}
                        />
                      </FormGroup>
                    </Col>
                    {!id && (
                      <>
                        <Col lg="4">
                          <FormGroup>
                            <label className="form-control-label">
                              Password{" "}
                              <span className="text-muted">
                                (* {lang.validation.error.minchar})
                              </span>
                            </label>
                            <AvField
                              name="password"
                              type="password"
                              className="form-control-alternative"
                              placeholder=""
                              validate={{
                                required: { value: true, errorMessage: " " },
                                minLength: {
                                  value: lang.validation.minchar,
                                  errorMessage:
                                  lang.validation.error.minchar,
                                },
                                maxLength: {
                                  value: lang.validation.maxchar,
                                  errorMessage:
                                  lang.validation.error.maxchar,
                                },
                              }}
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label className="form-control-label">
                              Comfirm Password
                            </label>
                            <AvField
                              name="cpassword"
                              type="password"
                              className="form-control-alternative"
                              placeholder=""
                              validate={{
                                required: { value: true, errorMessage: " " },
                                required: {
                                  value: true,
                                  errorMessage: lang.validation.error.confirmpass,
                                },
                                match: {
                                  value: "password",
                                  errorMessage: lang.validation.error.confirmpass,
                                },
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </>
                    )}
                    {id && (
                      <>
                        <Col lg="8">
                          <FormGroup>
                            <label className="form-control-label">
                              Password
                            </label>
                            <br />
                            <Button
                              color="success"
                              onClick={(e) => setmodalPassword(true)}
                            >
                              <i className="fas fa-key"></i> Change Password
                            </Button>
                          </FormGroup>
                        </Col>
                      </>
                    )}
                  </Row>
                </div>
                <hr className="my-4" />
                <div className="text-center">
                  <Button color="primary">
                    {parse(lang.button.save)}
                  </Button>
                </div>
              </AvForm>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ChangePass option={optionsModal} id={id} />
    </>
  );
}

export default CompanyForm;
