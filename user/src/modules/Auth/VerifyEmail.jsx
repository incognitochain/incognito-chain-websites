import React from "react";
// import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Loading from "components/Loading";
import Button from '@material-ui/core/Button';
import styled from "styled-components";

import CheckCircleOutline from "@material-ui/icons/DoneOutline";
import CloseOutline from "@material-ui/icons/Close";
import queryString from 'query-string'

import { actions as authActions } from "../../actions/auth";


class Popup extends React.Component{
  modalStyle = {
    width: '500px',
    height: '220px',
    textAlign: 'center',
    margin: 'auto',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '1px 2px 4px rgba(0, 0, 0, .5)',
    top: '50%',
    left: '50%',
  };

  buttonStyle = {
    border: '1px solid',
    borderRadius: '5px',

  }
  textSuccessStyle ={
    marginTop: '20px', 
    color: '#3366CC', 
    fontSize:'18px'
  }
  textFailedStyle ={
    marginTop: '20px', 
    color: '#DD0000', 
    fontSize:'18px'
  }
  wrapperStyle ={
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  }

  closePopup(){
    document.location.assign("/");
  }

  render() {
    return (
      <div style={this.wrapperStyle}>
        <div style={this.modalStyle}>
          { this.props.success === false ? <IconFailed/> : <IconSuccessed/>}
          <p style={this.props.success === false ? this.textFailedStyle : this.textSuccessStyle}>Email verification was { this.props.success === false ? 'failed!' : 'success!'} </p>
          <Button onClick={this.closePopup} style = {this.buttonStyle}>Go to Home Page</Button> 
        </div>
      </div>
    );
  }
}

class VerifyEmail extends React.Component {
  componentDidMount(){
    this.handleVerify();
  }

  handleVerify = async () => {
    const { verifyEmail } = this.props
    const values = queryString.parse(this.props.location.search)
    const token = values.token;
    await verifyEmail(token)
  }

  render(){
    const { isLoading, error } = this.props
    if (isLoading){
      return <Loading />
    } else {
      if (error != null){
        // show failed message
        return <Popup showModal={true} success={false}></Popup>     
      } else{
        // show success message
        return <Popup showModal={true} success ={true}></Popup>
      }
    }
  }
}

const IconSuccessed = styled(CheckCircleOutline)`
  font-size: 100px !important;
  color: #3366CC;
`;

const IconFailed = styled(CloseOutline)`
  font-size: 100px !important;
  color: #DD0000;
`;

export default connect(
  state => ({
    isLoading: state.auth.isLoading,
    error: state.auth.verifyEmailError,
  }),
  {
    verifyEmail: authActions.verifyEmail
  }
)(VerifyEmail);
