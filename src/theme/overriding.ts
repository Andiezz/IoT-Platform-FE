export type ThemeType = {
  token: {
    [key: string]: unknown;
  };
  components: {
    [key: string]: unknown;
  };
};

const theme: ThemeType = {
  token: {
    colorPrimary: '#183e97',
    controlHeight: 40,
    colorFill: '#FFFFFF'
  },
  components: {
    Layout: {
      colorBgHeader: '#183e97',
      colorBgMenu: 'red',
      Sider: {
        colorBgBase: 'red'
      }
    },
    Sider: {
      colorPrimary: '#FFFFFF'
    }
  }
};

export default theme;
