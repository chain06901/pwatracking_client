import React, { useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "functions/axiosinstance";
import * as Helpers from "functions/others";
import { useHistory } from "react-router-dom";
import { AvForm, AvInput } from "availity-reactstrap-validation";
import lang from "lang/th";
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
function UserForm(props) {
  const dispatch = useDispatch();
  const [role, setrole] = useState([]);
  const history = useHistory();
  const loading = useSelector((state) => state.loading);
  const title = "เพิ่มสิทธิใช้งาน";
  const OnSubmit = (e, data) => {
    Helpers.ConfirmDialog(
      lang.constant.confirmsave,
      lang.constant.recheckdata
    ).then(async (r) => {
      dispatch({ type: "SHOW_LOADING" });
      await axios()
        .post("/user/save", {
          user_id: data.user_id,
          role_id: data.role_id,
        })
        .then((res) => {
          if (res.data.status != 401) {
            dispatch({ type: "HIDE_LOADING" });
            Helpers.SuccessAlert(res.data).then((e) => {
              let user = Helpers.decode_payload();
              history.push("/" + user.role + "/users");
            });
          }
        });
    });
  };
  const loadRole = async (id) => {
    dispatch({ type: "SHOW_LOADING" });
    await axios()
      .get("/user/roles")
      .then((res) => {
        dispatch({ type: "HIDE_LOADING" });
        setrole(res.data);
      });
  };
  useLayoutEffect(() => {
    loadRole();
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
                        <label className="form-control-label">รหัสพนักงาน</label>
                        <AvInput
                          name="user_id"
                          type="text"
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="4">
                      <FormGroup>
                        <label className="form-control-label">สิทธิการใช้งาน</label>
                        <AvInput
                          name="role_id"
                          type="select"
                          required
                          maxLength="10"
                        >
                        <option value="">เลือก สิทธิการใช้งาน</option>
                          {role.map((r) => (
                            <option value={r.role_id}>{r.title}</option>
                          ))}
                          </AvInput>
                      </FormGroup>
                    </Col>
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
    </>
  );
}

export default UserForm;
