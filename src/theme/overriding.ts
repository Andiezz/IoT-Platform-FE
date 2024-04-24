export type ThemeType = {
	token: {
		[key: string]: unknown;
	};
  components: {
    [key: string]: unknown
  }
};

const theme: ThemeType = {
	token: {
		colorPrimary: '#102044',
    controlHeight: 40,
    colorFill: '#FFFFFF'
	},
  components:{
    Layout: {
      colorBgHeader: '#102044',
      colorBgMenu: 'red',
      Sider:{
        colorBgBase: 'red'
      }
    },
    Sider: {
      colorPrimary: '#FFFFFF'
    }
  }
};

export default theme;
