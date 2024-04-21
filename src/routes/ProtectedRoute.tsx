import React from 'react';
import { observer } from 'mobx-react-lite';
import { IAuthenticationService } from 'src/services/authentication.service';
import { Navigate, useLocation, matchRoutes } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import useService from 'src/hooks/use-service';
import { Permission } from 'src/constants/user';

interface IProtected {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProtected> = ({ children }) => {
  const location = useLocation();
  const authService: IAuthenticationService = useService(
    'authenticationService'
  );

  const ROUTE_PERMISSION_ACCESS_MAP: Record<any, Array<Permission>> = {
    [PAGE_ROUTE.DASHBOARD]: [] as Array<Permission>,
    [PAGE_ROUTE.DASHBOARD_ALARM]: [Permission.viewAlarmCenterPage],
    // Tenant
    [PAGE_ROUTE.DASHBOARD_TENANT]: [Permission.viewTenantCenterPage],
    [PAGE_ROUTE.DASHBOARD_TENANT_DETAIL]: [
      Permission.viewTenantCenterPage
    ],

    //Plant
    [PAGE_ROUTE.DASHBOARD_PLANT]: [Permission.viewPlantCenterPage],
    [PAGE_ROUTE.DASHBOARD_PLANT_DETAIL]: [Permission.viewPlantCenterPage],
    [PAGE_ROUTE.DASHBOARD_PLANT_UPDATE]: [
      Permission.updatePlant,
      Permission.viewPlantCenterPage
    ],
    [PAGE_ROUTE.DASHBOARD_PLANT_CREATE]: [
      Permission.createPlant,
      Permission.viewPlantCenterPage
    ],

    
    //   [PAGE_ROUTE.DASHBOARD_SYSTEM] = '/system',

    [PAGE_ROUTE.ACCOUNT_MANAGEMENT]: [Permission.viewAccountManagementPage],
    [PAGE_ROUTE.NEW_ACCOUNT]: [
      Permission.cudAccount,
      Permission.viewAccountManagementPage
    ],
    [PAGE_ROUTE.UPDATE_ACCOUNT]: [
      Permission.cudAccount,
      Permission.viewAccountManagementPage
    ],

    [PAGE_ROUTE.PROFILE]: [] as Array<Permission>,
    [PAGE_ROUTE.PROFILE_CHANGE_PASSWORD]: [] as Array<Permission>,

    [PAGE_ROUTE.USER_PERMISSION]: [
      Permission.viewAndUpdateUsersAndPermissionsPage
    ],
    [PAGE_ROUTE.COMMAND_LOGS]: [Permission.viewCommandLogPage]
    //   [PAGE_ROUTE.ACCESS_DENIED]: []
  };
  if (!authService.isAuthenticated) {
    return <Navigate to={PAGE_ROUTE.LOGIN} replace />;
  }
  //check permission
  const listMyPermission =
    authService.permissionRole?.groups.map((group) => group.permission.key) ||
    [];

  const listRoute = Object.values(PAGE_ROUTE as Object).map((value) => ({
    path: value
  }));
  const [{ route }] = matchRoutes(listRoute, location.pathname) || [];

  const listPermissionAccessRoute =
    ROUTE_PERMISSION_ACCESS_MAP[route.path as PAGE_ROUTE];
  if (
    listPermissionAccessRoute &&
    listPermissionAccessRoute.length &&
    listPermissionAccessRoute.some((r) => !listMyPermission.includes(r))
  ) {
    return <Navigate to={PAGE_ROUTE.ACCESS_DENIED} replace />;
  }
  return children;
};

export default observer(ProtectedRoute);
