import React from "react";
import { CardHeader, Row, CardFooter, Form } from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationTotalStandalone,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
function Datatable(props) {
  const { columns, rows, options } = props;
  const searchRef = React.useRef();
  const customTotal = (from, to, size) => (
    <>
      Showing rows {from} to {to} of {size}
    </>
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    let search = searchRef.current.value;
    options.onSearch(search);
  };
  const RemotePagination = ({ data, page, sizePerPage, totalSize }) => (
    <>
      <PaginationProvider
        pagination={paginationFactory({
          custom: true,
          page,
          sizePerPage,
          totalSize,
          paginationTotalRenderer: customTotal,
        })}
      >
        {({ paginationProps, paginationTableProps }) => (
          <>
            <CardHeader className="border-0">
              <Row>
                <div className="col-12">
                  <div className="float-left">
                    <h2 className="mb-0">
                      <i className={props.icon}></i> {props.name}
                    </h2>
                  </div>
                  <div className="float-right">
                    <Form inline>
                      <div className="input-group">
                        <input
                          className="form-control form-control-sm"
                          placeholder="ค้นหา Lot of product"
                          type="text"
                          name="search"
                          defaultValue={options.searchValue}
                          ref={searchRef}
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-info btn-sm"
                            type="button"
                            onClick={handleSubmit}
                          >
                            <i className="fas fa-search"></i>
                          </button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </Row>
            </CardHeader>
            <div className="table-responsive showtable">
              <BootstrapTable
                remote
                striped
                classes="table-sm table-flush"
                headerClasses="thead-light"
                keyField="id"
                data={data}
                columns={columns}
                onTableChange={options.onTableChange}
                {...paginationTableProps}
              />
            </div>
            <CardFooter className="py-3">
              <div className="float-left">
                {totalSize !== 0 && (
                  <PaginationTotalStandalone {...paginationProps} />
                )}
              </div>
              <div className="float-right">
                <PaginationListStandalone {...paginationProps} />
              </div>
            </CardFooter>
          </>
        )}
      </PaginationProvider>
    </>
  );

  //   const contentTable = ({ paginationProps, paginationTableProps }) => (
  //     <>
  //       <ToolkitProvider keyField="lot_id" columns={columns}  search>
  //         {(toolkitprops) => (
  //           <>
  //             <CardHeader className="border-0">
  //               <Row>
  //                 <div className="col">
  //                   <h2 className="mb-0">
  //                     <i className={props.icon}></i> {props.name}
  //                   </h2>
  //                 </div>
  //                 <Form inline className={"float-sm-right"}>
  //                   {/* {rows.length && (
  //                     <input
  //                       className="form-control form-control-sm"
  //                       placeholder="ค้นหา"
  //                       type="text"
  //                       onChange={(e) =>
  //                         toolkitprops.searchProps.onSearch(e.target.value)
  //                       }
  //                     />
  //                   )} */}
  //                 </Form>
  //               </Row>
  //             </CardHeader>
  //             <div className="table-responsive showtable">
  //               <BootstrapTable
  //                 remote
  //                 striped
  //                 classes="table-sm table-flush"
  //                 headerClasses="thead-light"
  //                 {...toolkitprops.baseProps}
  //                 {...paginationTableProps}
  //               />
  //             </div>
  //           </>
  //         )}
  //       </ToolkitProvider>
  //       <CardFooter className="py-3">
  //         <div className={"float-left"}>
  //           {/* {rows.length && <PaginationTotalStandalone {...paginationProps} />} */}
  //         </div>
  //         <div className="float-right">
  //           <PaginationListStandalone {...paginationProps} />
  //         </div>
  //       </CardFooter>
  //     </>
  //   );

  return (
    <>
      {/* <PaginationProvider pagination={paginationFactory(options)}>
        {contentTable}
      </PaginationProvider> */}
      <RemotePagination
        data={rows}
        page={options.page}
        sizePerPage={options.sizePerPage}
        totalSize={options.totalSize}
      />
    </>
  );
}
export default Datatable;
