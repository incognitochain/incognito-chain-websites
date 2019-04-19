import React from 'react';
import { ErrorMessage as Error } from 'formik';

const ErrorMessage = props => (
  <Error
    {...props}
  >
    {msg => (
      <span className="text-danger" style={{ fontSize: '14px' }}>{msg}</span>
    )}
  </Error>
);

export default ErrorMessage;
