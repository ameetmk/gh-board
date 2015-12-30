import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';

import history from './history';
import App from './components/app';
import Dashboard from './components/dashboard';
import RepoKanban from './components/repo-kanban';
import ByMilestoneView from './components/by-milestone-view';
import ByUserView from './components/by-user-view';
import MergedSince from './components/merged-since';

import {parseRoute, buildRoute, setFilters} from './route-utils';

// !!!!!!!! Note: It is IMPORTANT for parseRoute and buildRoute that the
// paths directly under the `setFilters` path be simple (no slashes or patterns)
// This allows us to _make everything a link_. We use that "simple" path
// to generate a link containing that path segment in it.
// The *only* exception is the `indexRoute: RepoKanban` on. It's nice to have an index

const routes = [
  // Redirect from `/dashboard` to `/`
  { path: '/dashboard',
    onEnter: (state, replace) => replace(null, '/')
  },
  { path: '/',
    component: App,
    indexRoute: { component: Dashboard },
    childRoutes: [
      { path: '/r/:repoStr(/m/:milestonesStr)(/t/:tagsStr)(/u/:userName)(/x/:columnRegExpStr)',
        // Remember: Save all the filter criteria by adding onEnter
        onEnter: setFilters,
        indexRoute: {component: RepoKanban},
        // If you change these children (or the parents) make sure you edit RELEVANT_PATH_SEGMENT in another file.
        childRoutes: [
          // Redirect from `/r/.../kanban` to `/r/...` . keep 'kanban' in the code so it is clear where the link is going
          { path: 'kanban',
            onEnter: (state, replace) => replace(null, buildRoute('', parseRoute(state)))
          },
          { path: 'since/:startShas(/:endShas)', onEnter: setFilters, component: MergedSince},
          { path: 'by-milestone', onEnter: setFilters, component: ByMilestoneView },
          { path: 'by-user', onEnter: setFilters, component: ByUserView },
          // Redirect to the gantt URL
          { path: 'milestone-review', onEnter: setFilters, onEnter: (state, replace) => replace(null, buildRoute('gantt', parseRoute(state))) },
          { path: 'gantt', onEnter: setFilters,
            // Keep the review page as a separate chunk because it contains d3
            getComponent(location, callback) {
              require.ensure([], (require) => {
                // Remember to add the `.default`!
                callback(null, require('./components/gantt-view').default);
              });
            }
          }
      ] },
    ],
  }
];

const router = React.createElement(Router, {history, routes});

export default function() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  ReactDOM.render(router, div);
}
