module.exports = {
  extends: ["airbnb", "prettier"],
  parser: "babel-eslint",
  env: {
    browser: true
  },
  rules: {
    "max-len": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
    "react/forbid-prop-types": "off",
    "react/no-array-index-key": "off",
    "react/prop-types": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/label-has-for": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "react/no-danger": "off",
    "no-console": "off",
    "prefer-template": "off",
    "import/order": "off",
    "lines-between-class-members": "off",
    "react/jsx-indent": "off",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-closing-tag-location": "off",
    "react/destructuring-assignment": "off"
  },
  settings: {
    "import/resolver": "webpack"
  },
  globals: {
    web3: true,
    DEBUG: true
  }
};
