```js
import React from 'react';

class ComponentName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className="css-page" />;
  }
}

export default ComponentName;
```

```js
import { ACTIONS } from './action';

export default (state = {
}, action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};
```
