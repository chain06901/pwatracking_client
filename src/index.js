import React, { useEffect } from "react";
import { Provider,useDispatch,useSelector } from 'react-redux';
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import store from "./store";
import Login from "components/Public/Login.js";
import routes from "routes";
import { PrivateRoute, LoginRoute } from "functions/authRoute";
import Loading from "functions/loading";
import * as Helpers from "functions/others";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/css/argon-dashboard-react.css";
import "assets/css/style.css";

function App() {
  const loading = useSelector(state => state.loading);
  const dispatch  = useDispatch();
  const role = ["admin", "company", "employee"];
  const token = localStorage.getItem("token");
  store.subscribe( () => {
    //console.log(store.getState());
  });
  useEffect(() => {
    if (token) {
      let user = Helpers.decode_payload();
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    }
  }, []);
  return (
    <>
      <Loading isLoading={loading} />
      <BrowserRouter basename={"/"+process.env.REACT_APP_FOLDER}>
        <Switch>
          <LoginRoute exact path="/" />
          <Route path="/login">{token ? <Redirect to="/" /> : <Login />}</Route>
          {role.map((value) => {
            return routes
              .filter((rows) => rows[value])
              .map((row, key) => {
                let path = "/" + value + row.path;
                return (
                  <PrivateRoute
                    key={key}
                    path={path}
                    exact={row.exact}
                    routesdetail={row}
                    component={row.component}
                  />
                );
              });
          })}
          {role.map((value) => {
            return routes
              .filter((rows) => rows['public'])
              .map((row, key) => {
                let path = row.path;
                return (
                  <Route
                    key={key}
                    path={path}
                    exact={row.exact}
                    routesdetail={row}
                    component={row.component}
                  />
                );
              });
          })}
          {token ? <Redirect to="/" /> : <Redirect to="/login" />}
        </Switch>
      </BrowserRouter>
    </>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
