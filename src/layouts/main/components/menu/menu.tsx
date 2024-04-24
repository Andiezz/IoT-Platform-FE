import { Menu } from 'antd';
import React from 'react';
import { useLocation } from 'react-router-dom';
import useMenuItem from 'src/hooks/use-menu-item';
import styles from './menu.module.less';
import { observer } from 'mobx-react-lite';

interface IMenuItem {
  requiredPermission?: Array<any>;
  children?: IMenuItem[];
}

interface IProps {
  setMenuBar?: React.Dispatch<React.SetStateAction<any>>;
}

const AppMenu: React.FC<IProps> = ({ setMenuBar }: IProps) => {
  const menuItems = useMenuItem();
  const location = useLocation();

  // set active menu
  const getSelectedKeys = (pathname: string) => {
    const selectedKeys: [] = [];


      menuItems.forEach((item: any, index: number) => {
        if (pathname.includes(item?.key as string) && index !== 0)
          selectedKeys.push(item?.key as never);

        item?.children?.forEach((x: any) => {
          if (pathname.includes(x.key)) selectedKeys.push(x?.key as never);
        });
      });
    

    return selectedKeys;
  };

  const recursion = (item: IMenuItem, menu: IMenuItem[]) => {
    if (!item.children) {
      return menu;
    } else {
      const menuChildren = item.children.reduce(
        (menuChildren: Array<IMenuItem>, itemChildren: IMenuItem) => {
          return recursion(itemChildren, menuChildren);
        },
        [] as IMenuItem[]
      );
      if (menuChildren?.length) {
        item.children = menuChildren;
        delete item.requiredPermission;
        menu.push(item);
      }
      return menu;
    }
  };
  const menuItemAddEvent = menuItems.map((menuItem: any) => ({
    ...menuItem,
    onClick: () => {
      setMenuBar && setMenuBar(false);
      !menuItem.children && menuItem?.onClick();
    },
    children:
      menuItem?.children?.map((itemChildren: any) => {
        return {
          ...itemChildren,
          onClick: () => {
            setMenuBar && setMenuBar(false);
            itemChildren?.onClick();
          }
        };
      })
  }));
  
  const menuPermission = menuItemAddEvent.reduce((menu: any, item: any) => {
    return recursion(item, menu);
  }, [] as IMenuItem[]);

  return (
    <Menu
      items={menuPermission}
      mode="inline"
      defaultActiveFirst
      selectedKeys={getSelectedKeys(location.pathname)}
      className={styles.menu_wrapper}
    />
  );
};

export default observer(AppMenu);
