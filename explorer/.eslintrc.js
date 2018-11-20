module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
  },
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/forbid-prop-types": "off",
    // will turn on later
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "react/no-danger": "off",
    "no-console": "off"
  },
  "settings": {
    "import/resolver": "webpack",
  },
  "globals": {
    "web3": true,
    "DEBUG": true
  }
};
