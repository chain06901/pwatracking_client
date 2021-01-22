import React, { useState, useLayoutEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import {
  Container,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap";
import parse from "html-react-parser";
import axios from "functions/axiosinstance";
import lang from "lang/th";
import { AvForm, AvInput, AvGroup } from "availity-reactstrap-validation";
import * as Helpers from "functions/others";

function Login() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const dispatch = useDispatch();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const history = useHistory();
  useLayoutEffect(() => {
    if (isLoggedIn) {
      let user = Helpers.decode_payload();
      dispatch({ type: "LOGIN_SUCCESS",payload:user });
      history.push(user.role + "/dashboard");
    }
  });
  const onSubmit = () => {
   dispatch({ type: "SHOW_LOADING" });
    axios()
      .post("/login", {
        username: username,
        password: password,
      })
      .then((r) => {
        if (r.data.login) {
          localStorage.setItem("token", r.data.token);
          setisLoggedIn(true);
        }
      })
      .catch((e) => {
        
      });
  };

  return (
    <>
      <div className="main-content bg-gradient-light">
        <Container className="pt-8 pb-5">
          <Row className="justify-content-center">
            <Col lg="5" md="7">
              <Card className=" shadow border-0">
                <CardHeader className="bg-transparent pb-3">
                  <img
                    className="img-fluid"
                    src={require(process.env.REACT_APP_LOGO)}
                    alt=""
                  />
                </CardHeader>
                <CardBody>
                  <div className="text-center mb-4">
                    <h3 className="text-muted">
                      {process.env.REACT_APP_TITLE_S}
                    </h3>
                  </div>
                  <AvForm onValidSubmit={onSubmit}>
                    <AvGroup>
                      <AvInput
                        name="username"
                        type="text"
                        placeholder="Username"
                        className="form-control-alternative"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </AvGroup>
                    <AvInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      className="form-control-alternative"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="text-center">
                      <Button className="my-4" color="primary">
                        {parse(lang.button.login)}
                      </Button>
                    </div>
                  </AvForm>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}


export default Login;
