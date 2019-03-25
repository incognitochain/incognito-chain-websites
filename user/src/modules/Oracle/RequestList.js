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

import { getOracleMetadatas } from "../../services/oracle";

const mapStateToProps = (state) => {
  return {

  }
}
const mapDispatchToProps = (dispatch) => {
  return {

  }
}

class RequestList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      oracleMetadatas: [],
      pagination: {},
    }
  }
  componentDidMount() {
    this.onGetOracleMetadatas();
  }

  onGetOracleMetadatas = async (perPage, page) => {
    const res = await getOracleMetadatas(perPage, page);
    const {result = [], error=""} = res;
    if (error) {
      console.log("get oracle metadata error", error);
      return;
    }
    let { Records = [], ...pagination } = result;
    if (Records === null) Records = [];
    this.setState({ oracleMetadatas: Records, pagination });
  }

  onChangePage = (page) => {
    const {pagination} = this.state;
    const {Limit=10} = pagination;
    this.onGetOracleMetadatas(Limit, page+1);
  }
  onChangeRowsPerPage = (perPage) => {
    console.log(perPage);
    this.onGetOracleMetadatas(perPage, 1);
  }
  // onCreateClick = () => {
  //   this.props.history && this.props.history.push && this.props.history.push('/oracle/create');
  // }

  render() {
    const {oracleMetadatas = [], pagination = {}} = this.state;
    return (
      <div className="page user-page home-page">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12">
              <div className="c-card">
                <div className="hello" style={{display:"flex", justifyContent: "space-between", alignContent: "center" }}>
                  Request list

                  <FormControl component="fieldset" >
                    <Link className="c-btn c-btn-primary submit" to='/oracle/create' >Create Request</Link>
                  </FormControl>

                </div>

                <table className="c-table-portal-home" style={{minWidth: "100%"}}>
                  <thead>
                    <tr>
                      {/* <th>ID</th> */}
                      <th>Public Key</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    { oracleMetadatas && oracleMetadatas.map((item={}) => {
                      return (
                        <tr key={`metadata-item-${item.ID}`}>
                          {/* <td><Link to={`/oracle/${item.ID}/detail`}>{item.ID} </Link></td> */}
                          <td>{item.PubKeys && item.PubKeys.length > 0 && item.PubKeys.map((key="",i)=>{
                            return (
                              <Link key={`p-key-${i}`} to={`/oracle/${item.ID}/detail`}> <div >{key} <br/></div> </Link>
                            )
                          })}</td>
                          <td>{item.Status}</td>
                          <td>{item.CreatedAt ? dayjs(item.CreatedAt).format('MM-DD-YYYY') : ""}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                { oracleMetadatas.length > 0 && pagination && Object.keys(pagination).length > 0 ?
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={3}
                  count={pagination.TotalRecord}
                  rowsPerPage={pagination.Limit}
                  page={pagination.Page-1}
                  SelectProps={{
                    // native: true,
                  }}
                  onChangePage={(e,p)=>(this.onChangePage(p))}
                  onChangeRowsPerPage={(e)=>this.onChangeRowsPerPage(e.target.value)}
                />
                : ""}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestList)
