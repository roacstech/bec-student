// ==============================|| THEME CONSTANT ||============================== //
export const twitterColor = '#1DA1F2';
export const facebookColor = '#3B5998';
export const linkedInColor = '#0E76A8';
export const APP_DEFAULT_PATH = '/dashboard';
export const HORIZONTAL_MAX_ITEM = 7;
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;
// export const BASE_URL = "http://localhost:9671/api/ont/v1/dev/"
export const BASE_URL = import.meta.env.VITE_APP_API_URL;
export let SimpleLayoutType;
(function (SimpleLayoutType) {
  SimpleLayoutType['SIMPLE'] = 'simple';
  SimpleLayoutType['LANDING'] = 'landing';
})(SimpleLayoutType || (SimpleLayoutType = {}));
export let ThemeMode;
(function (ThemeMode) {
  ThemeMode['LIGHT'] = 'light';
  ThemeMode['DARK'] = 'dark';
})(ThemeMode || (ThemeMode = {}));
export let MenuOrientation;
(function (MenuOrientation) {
  MenuOrientation['VERTICAL'] = 'vertical';
  MenuOrientation['HORIZONTAL'] = 'horizontal';
})(MenuOrientation || (MenuOrientation = {}));
export let ThemeDirection;
(function (ThemeDirection) {
  ThemeDirection['LTR'] = 'ltr';
  ThemeDirection['RTL'] = 'rtl';
})(ThemeDirection || (ThemeDirection = {}));
export let NavActionType;
(function (NavActionType) {
  NavActionType['FUNCTION'] = 'function';
  NavActionType['LINK'] = 'link';
})(NavActionType || (NavActionType = {}));
export let DropzopType;
(function (DropzopType) {
  DropzopType['DEFAULT'] = 'default';
  DropzopType['STANDARD'] = 'standard';
})(DropzopType || (DropzopType = {}));
// ==============================|| THEME CONFIG ||============================== //
const config = {
  // fontFamily: `'Public Sans', sans-serif`,
  fontFamily: `Poppins, sans-serif`,
  i18n: 'en',
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  container: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'theme3',
  themeDirection: ThemeDirection.LTR
};
export default config;
