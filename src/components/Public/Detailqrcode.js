import React, { useLayoutEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import qs from "query-string";
import axios from "functions/axiosinstance";
import lang from "lang/th";
import { Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
function Detail(props) {
  const css = `
    body {
        background-color: #eaeaea;
    }
  `;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const history = useHistory();
  const query = qs.parse(history.location.search);
  useLayoutEffect(() => {
    axios()
      .post("/detail", {
        id: query.id,
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((e) => {});
  }, []);
  const showindex = (index) => {
    if (index) {
      return (
        <tr>
          <th>ลำดับที่</th>
          <td>{index}</td>
        </tr>
      );
    }
  };
  return (
    <>
      <style>{css}</style>
      <nav className={(loading ? "d-none" : "") + " bg-gradient-pwa p-3"}>
        <div className="container-fluid">
          <span className="h2 mb-0 text-white text-uppercase">
            การประปาส่วนภูมิภาค
          </span>
        </div>
      </nav>
      <Container className={loading ? "d-none" : ""}>
        <Row className="justify-content-center">
          <Col>
            <Card className="shadow border-0 my-4">
              <CardHeader className="py-3">
                <h2 className="mb-0 ">
                  <i className="far fa-file-alt"></i> รายละเอียด
                </h2>
              </CardHeader>
              <CardBody className="p-0">
                <table className="table table-wrap table-striped  table-sm">
                  <tbody>
                    <tr>
                      <th width="30%">{lang.lot.company}</th>
                      <td>{data.company_name}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.contract}</th>
                      <td>
                        {data.contract_number}
                      </td>
                    </tr>
                    <tr>
                      <th>{lang.lot.pipeFittinglotNo}</th>
                      <td>{data.lotofproduct}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.p_id}</th>
                      <td>{data.producersname}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.coa_material}</th>
                      <td>{data.coa_material}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.coa_product}</th>
                      <td>{data.coa_product}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.coa_delivery}</th>
                      <td>{data.coa_delivery}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.material}</th>
                      <td>{data.material}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.pressure_class}</th>
                      <td>{data.pressure_class}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.component_id}</th>
                      <td>{data.componentname}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.category_parent}</th>
                      <td>{data.categoryparent}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.category_id}</th>
                      <td>{data.category}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.size_diameter}</th>
                      <td>{data.size_diameter}</td>
                    </tr>
                    <tr>
                      <th>{lang.lot.weight}</th>
                      <td>{data.weight}</td>
                    </tr>
                    {(() => {
                      if(data.index)
                      {
                      return(
                        <>
                    <tr>
                      <th>{lang.lot.index}</th>
                      <td>{data.index}</td>
                    </tr>
                     </>
                     );
                   }
                 })()}
                    <tr>
                      <th>{lang.lot.amount}</th>
                      <td>{data.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Detail;
