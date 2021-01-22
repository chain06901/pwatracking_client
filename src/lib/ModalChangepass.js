import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "functions/axiosinstance";
import { AvForm, AvField } from "availity-reactstrap-validation";
import lang from "../lang/th";
import {
  Button,
  FormGroup,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import * as Helpers from "functions/others";

function ModalChangepass(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const OnSubmitResetpassword = async (e, values) => {
    dispatch({ type: "SHOW_LOADING" });
    await axios()
      .post("/company/resetpassword", {
        id: props.id,
        oldpassword: values.oldpassword,
        password: values.newpassword,
      })
      .then((res) => {
          dispatch({ type: "HIDE_LOADING" });
          Helpers.SuccessAlert(res.data).then((e) => {
            props.option.onClose();
          });
      });
  };
  return (
    <>
      <Modal isOpen={props.option.onOpen}>
        <ModalHeader toggle={props.option.onClose}>Change Password</ModalHeader>
        <ModalBody className="bg-secondary">
          <Col>
            <AvForm onValidSubmit={OnSubmitResetpassword}>
              {user.role_id == 2 && (
                <>
                  <FormGroup>
                    <label className="form-control-label">Old Password </label>
                    <AvField
                      name="oldpassword"
                      type="password"
                      className="form-control-alternative"
                      placeholder=""
                      validate={{
                        required: { value: true, errorMessage: " " },
                      }}
                    />
                  </FormGroup>
                </>
              )}

              <FormGroup>
                <label className="form-control-label">
                  New Password{" "}
                  <span className="text-muted">(* {lang.validation.error.minchar})</span>
                </label>
                <AvField
                  name="newpassword"
                  type="password"
                  className="form-control-alternative"
                  placeholder=""
                  validate={{
                    required: { value: true, errorMessage: " " },
                    minLength: {
                      value: lang.validation.minchar,
                      errorMessage: lang.validation.error.minchar,
                    },
                    maxLength: {
                      value: lang.validation.maxchar,
                      errorMessage: lang.validation.error.maxchar,
                    },
                  }}
                />
              </FormGroup>
              <FormGroup>
                <label className="form-control-label">Comfirm Password</label>
                <AvField
                  name="cnewpassword"
                  type="password"
                  className="form-control-alternative"
                  placeholder=""
                  validate={{
                    required: { value: true, errorMessage: " " },
                    required: {
                      value: true,
                      errorMessage: "Password ไม่ตรงกัน",
                    },
                    match: {
                      value: "newpassword",
                      errorMessage: "Password ไม่ตรงกัน",
                    },
                  }}
                />
              </FormGroup>
              <div className="text-center">
                <Button color="primary">{"ยืนยัน"}</Button>
              </div>
            </AvForm>
          </Col>
        </ModalBody>
      </Modal>
    </>
  );
}
export default ModalChangepass;
