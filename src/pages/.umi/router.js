import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/user",
        "exact": true,
        "component": require('../user/index.js').default,
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      },
      {
        "path": "/user/config",
        "exact": true,
        "component": require('../user/config.js').default,
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      },
      {
        "path": "/register",
        "exact": true,
        "component": require('../register/index.js').default,
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      },
      {
        "path": "/login",
        "exact": true,
        "component": require('../login/index.js').default,
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default,
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      },
      {
        "path": "/dept",
        "exact": true,
        "component": require('../dept/index.js').default,
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      },
      {
        "path": "/dept/config",
        "exact": true,
        "component": require('../dept/config.js').default,
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      },
      {
        "path": "/404",
        "exact": true,
        "component": require('../404/index.js').default,
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      },
      {
        "component": () => React.createElement(require('/Users/blean/ustbhr_web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false }),
        "_title": "USTB考勤",
        "_title_default": "USTB考勤"
      }
    ],
    "_title": "USTB考勤",
    "_title_default": "USTB考勤"
  },
  {
    "component": () => React.createElement(require('/Users/blean/ustbhr_web/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: false }),
    "_title": "USTB考勤",
    "_title_default": "USTB考勤"
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
