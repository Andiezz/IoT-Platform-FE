import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import BareLayout from 'src/layouts/bare/bare.layout';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from 'src/layouts/main/main.layout';
import { uniqueKey } from 'src/helpers/string.utils';

const NotFoundPage = lazy(() => import('src/pages/404/404'));

type RouteType = {
  index?: boolean;
  path?: string;
  element: React.LazyExoticComponent<React.FC>;
  children?: RouteType[];
};

const publicRoutes: RouteType[] = [
  {
    path: PAGE_ROUTE.LOGIN,
    element: lazy(() => import('src/pages/base.page')),
    children: [
      {
        index: true,
        element: lazy(() => import('src/pages/login/login'))
      }
    ]
  },
  {
    path: PAGE_ROUTE.FORGOT_PASSWORD,
    element: lazy(
      () =>
        import(
          'src/pages/login/components/forgot-password/forgot-password.page'
        )
    )
  },
  {
    path: PAGE_ROUTE.CHANGE_PASSWORD,
    element: lazy(
      () =>
        import(
          'src/pages/login/components/change-password/change-password.page'
        )
    )
  }
];

const privateRoutes: RouteType[] = [
  {
    path: PAGE_ROUTE.DASHBOARD,
    element: lazy(() => import('src/pages/dashboard/dashboard'))
  },
  {
    path: PAGE_ROUTE.DASHBOARD_ALARM,
    element: lazy(() => import('src/pages/alarm/alarm'))
  },
  {
    path: PAGE_ROUTE.DASHBOARD_TENANT,
    element: lazy(() => import('src/pages/tenant/tenant'))
  },
  {
    path: PAGE_ROUTE.DASHBOARD_TENANT_DETAIL,
    element: lazy(() => import('src/pages/tenant/tenant-detail/tenant-detail'))
  },
  {
    path: PAGE_ROUTE.DASHBOARD_PLANT,
    element: lazy(() => import('src/pages/plant/plant'))
  },
  {
    path: PAGE_ROUTE.DASHBOARD_PLANT_CREATE,
    element: lazy(
      () => import('src/pages/plant/request-form/request-form.page')
    )
  },
  {
    path: PAGE_ROUTE.DASHBOARD_PLANT_UPDATE,
    element: lazy(
      () => import('src/pages/plant/request-form/request-form.page')
    )
  },
  {
    path: PAGE_ROUTE.DASHBOARD_OVERVIEW_EMS,
    element: lazy(
      () => import('src/pages/dashboard/overview/ems-overview/ems-overview')
    )
  },
  {
    path: PAGE_ROUTE.DASHBOARD_OVERVIEW_TENANT,
    element: lazy(() => import('src/pages/dashboard/dashboard'))
  },
  {
    path: PAGE_ROUTE.DASHBOARD_OVERVIEW_CELL_DRIVER,
    element: lazy(
      () =>
        import(
          'src/pages/dashboard/overview/cell-driver-overview/cell-driver-overview'
        )
    )
  },
  {
    path: PAGE_ROUTE.DASHBOARD_OVERVIEW_CELL,
    element: lazy(
      () => import('src/pages/dashboard/overview/cell-overview/cell-overview')
    )
  },
  {
    path: PAGE_ROUTE.DASHBOARD_OVERVIEW_PLANT,
    element: lazy(
      () => import('src/pages/dashboard/overview/ems-overview/ems-overview')
    )
  },
  {
    path: PAGE_ROUTE.ACCOUNT_MANAGEMENT,
    element: lazy(
      () =>
        import(
          'src/pages/system-management/account-management/account-management'
        )
    )
  },
  {
    path: PAGE_ROUTE.NEW_ACCOUNT,
    element: lazy(
      () =>
        import(
          'src/pages/system-management/account-management/new-account/create-account-form'
        )
    )
  },
  {
    path: PAGE_ROUTE.UPDATE_ACCOUNT,
    element: lazy(
      () =>
        import(
          'src/pages/system-management/account-management/new-account/create-account-form'
        )
    )
  },
  {
    path: PAGE_ROUTE.PROFILE,
    element: lazy(() => import('src/pages/profile/my-profile'))
  },
  {
    path: PAGE_ROUTE.PROFILE_CHANGE_PASSWORD,
    element: lazy(
      () =>
        import('src/pages/profile/component/change-password/change-password')
    )
  },
  {
    path: PAGE_ROUTE.USER_PERMISSION,
    element: lazy(
      () =>
        import('src/pages/system-management/users-permissions/users-permission')
    )
  },
  {
    path: PAGE_ROUTE.TENANT_DETAIL,
    element: lazy(() => import('src/pages/tenant/tenant-detail/tenant-detail'))
  },
  {
    path: PAGE_ROUTE.DASHBOARD_PLANT_DETAIL,
    element: lazy(() => import('src/pages/plant/plant-detail/plant-detail'))
  },
  {
    path: PAGE_ROUTE.COMMAND_LOGS,
    element: lazy(
      () => import('src/pages/system-management/command-logs/command-logs')
    )
  },
  {
    path: PAGE_ROUTE.USER_ACTIVITY_LOGS,
    element: lazy(
      () =>
        import(
          'src/pages/system-management/user-activity-logs/user-activity-logs'
        )
    )
  },
  {
    path: PAGE_ROUTE.ACCESS_DENIED,
    element: lazy(() => import('src/components/access-denied/access-denied'))
  }
];

const renderRoute = (routes: RouteType[]) =>
  routes.map((r) => {
    const routeOptions: any = r.index ? { index: true } : { path: r.path };
    const Element = r.element;
    return (
      <Route
        key={uniqueKey(10)}
        path={routeOptions.path}
        element={
          <Suspense>
            <Element />
          </Suspense>
        }
        {...routeOptions}>
        {r.children?.map(({ element: ChildElement, ...rest }) => {
          return rest.index ? (
            <Route
              key={uniqueKey(10)}
              index
              element={
                <Suspense>
                  <ChildElement />
                </Suspense>
              }
            />
          ) : (
            <Route
              key={uniqueKey(10)}
              element={
                <Suspense>
                  <ChildElement />
                </Suspense>
              }>
              {rest.children && renderRoute(rest.children)}
            </Route>
          );
        })}
      </Route>
    );
  });

const AppRouters: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BareLayout />}>{renderRoute(publicRoutes)}</Route>
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
          {renderRoute(privateRoutes)}
        </Route>
        <Route
          path="*"
          element={
            <Suspense>
              <NotFoundPage />
            </Suspense>
          }></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouters;
