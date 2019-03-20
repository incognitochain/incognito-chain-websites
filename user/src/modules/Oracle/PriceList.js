import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import dayjs from 'dayjs';

import {
  TextField,
  TablePagination,
  FormControl,
} from '@material-ui/core';

import Link from "components/Link";

const mapStateToProps = (state) => {
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

class PriceList extends React.Component {

  render() {
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="hello" style={{display:"flex", justifyContent: "space-between", alignContent: "center" }}>
                  Price List
                </div>

                <table className="c-table-portal-home" style={{minWidth: "100%"}}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr >
                      <td><Link to={"/oracle/detail"}>item.ID </Link></td>
                      <td>item.Amount</td>
                      <td>item.Status</td>
                      <td>{` dayjs(item.CreatedAt).format('MM-DD-YYYY') `}</td>
                    </tr>
                    <tr >
                      <td><Link to={"/oracle/detail"}>item.ID </Link></td>
                      <td>item.Amount</td>
                      <td>item.Status</td>
                      <td>{` dayjs(item.CreatedAt).format('MM-DD-YYYY') `}</td>
                    </tr>
                    <tr >
                      <td><Link to={"/oracle/detail"}>item.ID </Link></td>
                      <td>item.Amount</td>
                      <td>item.Status</td>
                      <td>{` dayjs(item.CreatedAt).format('MM-DD-YYYY') `}</td>
                    </tr>
                  </tbody>
                </table>

                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={3}
                  count={20}
                  rowsPerPage={5}
                  page={1}
                  SelectProps={{
                    // native: true,
                  }}
                  onChangePage={(e,p)=>(console.log(p))}
                  onChangeRowsPerPage={(e)=>console.log(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PriceList)
