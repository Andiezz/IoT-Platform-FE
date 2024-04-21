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
		colorPrimary: '#2B7AE8',
    controlHeight: 40,
    colorFill: '#FFFFFF'
	},
  components:{
    Layout: {
      colorBgHeader: '#2B7AE8',
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
