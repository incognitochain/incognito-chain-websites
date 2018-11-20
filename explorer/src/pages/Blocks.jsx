import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class Block extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="block-page">
        <Card>
          <CardContent>
            a
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default Block;
