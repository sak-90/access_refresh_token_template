const config = {
  moduleNameMapper: {
    "^@/(.*)$": "../tests",
  },
  transform: {
    "^.+\\.js?$": "babel-jest",
  },
};
export default config;
