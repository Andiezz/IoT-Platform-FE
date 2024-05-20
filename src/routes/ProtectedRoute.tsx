import React from 'react';
import { observer } from 'mobx-react-lite';
import { IAuthenticationService } from 'src/services/authentication.service';
import { Navigate } from 'react-router-dom';
import { PAGE_ROUTE } from 'src/constants/route';
import useService from 'src/hooks/use-service';

interface IProtected {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProtected> = ({ children }) => {
  const authService: IAuthenticationService = useService(
    'authenticationService'
  );

  if (!authService.isAuthenticated) {
    return <Navigate to={PAGE_ROUTE.LOGIN} replace />;
  }
  return children;
};

export default observer(ProtectedRoute);
