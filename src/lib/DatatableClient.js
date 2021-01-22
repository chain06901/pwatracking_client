import React from "react";
import { CardHeader, Row, CardFooter, Form } from "reactstrap";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
function DatatableClient(props) {
  const { rows, columns, options,primary_id } = props;

  const contentTable = ({ paginationProps, paginationTableProps }) => (
    <>
      <ToolkitProvider keyField={primary_id} data={rows} columns={columns} search>
        {(toolkitprops) => (
          <>
            <div className="table-responsive showtable">
              {/* {(() => {
                if (rows.length)
                  return (
                    <>
                      <hr class="mt-1 mb-3" />
                      <Form inline className={"pb-3 px-3 float-md-right"}>
                        <input
                          className="form-control form-control-sm"
                          placeholder="ค้นหา"
                          type="text"
                          onChange={(e) =>
                            toolkitprops.searchProps.onSearch(e.target.value)
                          }
                        />
                      </Form>
                    </>
                  );
              })()} */}

              <BootstrapTable
                striped
                classes="table-sm table-flush"
                headerClasses="thead-light"
                {...toolkitprops.baseProps}
                {...paginationTableProps}
              />
            </div>
          </>
        )}
      </ToolkitProvider>
      <CardFooter className="py-3">
        <div className={"float-left"}>
          {(() => {
            if (rows.length)
              return (
                <>
                  <PaginationTotalStandalone {...paginationProps} />
                </>
              );
          })()}
        </div>
        <div className="float-right">
          {(() => {
            if (rows.length)
              return (
                <>
                  <PaginationListStandalone {...paginationProps} />
                </>
              );
          })()}
        </div>
      </CardFooter>
    </>
  );

  return (
    <>
      <PaginationProvider pagination={paginationFactory(options)}>
        {contentTable}
      </PaginationProvider>
    </>
  );
}
export default DatatableClient;
