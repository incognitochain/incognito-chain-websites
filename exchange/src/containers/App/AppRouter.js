import React from "react";
import {Route} from "react-router-dom";
import asyncComponent from "../../helpers/AsyncFunc";

const AppRouter = () => {
  return (
    <>
      <Route
        exact
        path={"/"}
        component={asyncComponent(() => import("@/containers/Market"))}
      />
      <Route
        path={"/exchange"}
        component={asyncComponent(() => import("@/containers/Exchange"))}
      />
      <Route
        exact
        path={"/bond-market"}
        component={asyncComponent(() =>
          import("@/containers/BondMarket/BondMarket")
        )}
      />
      <Route
        exact
        path={"/bond-market/history"}
        component={asyncComponent(() =>
          import("@/containers/BondMarket/BondHistory")
        )}
      />
      <Route
        exact
        path={"/crowdsale"}
        component={asyncComponent(() =>
          import("@/containers/Crowdsale/Crowdsale")
        )}
      />
      <Route
        exact
        path="/crowdsale/history"
        component={asyncComponent(() =>
          import("@/containers/Crowdsale/CrowdsaleHistory")
        )}
      />
    </>
  );
};

export default AppRouter;
