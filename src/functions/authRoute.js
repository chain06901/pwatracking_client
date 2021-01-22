import React, { useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router";
import { Route } from "react-router-dom";
import Layout from "components/Layout.js";
import auth from "functions/auth";
import * as Helpers from "functions/others";

const LoginRoute = (path) => {
  const [Loading, setLoading] = useState(true);
  const [Login, setLogin] = useState();
  const [user, setUser] = useState();
  useEffect(() => {
    let user = Helpers.decode_payload();
    if (user) {
      setUser(user);
      setLogin(true);
      setLoading(false);
    } else {
      setLogin(false);
      setLoading(false);
    }
  }, []);

  return (
    <Route
      path={path}
      render={() =>
        Login ? (
          <Redirect to={user.role + "/dashboard"} />
        ) : Loading ? (
          ""
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

const PrivateRoute = ({ component: Component, exact, path, ...rest }) => {
  const [Loading, setLoading] = useState(true);
  const [Login, setLogin] = useState();
  const [Unauth, setUnauth] = useState();
  const location = useLocation();
  useEffect(() => {
    let user = Helpers.decode_payload();
    if (user) {
      if (location.pathname.indexOf(user.role) > -1) {
        setLogin(true);
        setLoading(false);
      } else {
        setUnauth(true);
        setLogin(false);
        setLoading(false);
      }
    } else {
      setUnauth(false);
      setLogin(false);
      setLoading(false);
    }
  }, [location]);

  return (
    <Route
      path={path}
      render={(props) =>
        Login ? (
          <Layout {...rest}>
            <Component {...props} {...rest} />
          </Layout>
        ) : Loading ? (
          ""
        ) : Unauth ? auth.logout() : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export { PrivateRoute, LoginRoute };
