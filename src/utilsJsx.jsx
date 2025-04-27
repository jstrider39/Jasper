import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";

export default class UtilsJsx {
  constructor(set, get) {
    this.set = set;
    this.get = get;
  }

  init() {}

  get darkTheme() {
    return createTheme({
      palette: {
        mode: "dark",
      },
    });
  }

  ThemeProvider = ({ children }) => {
    return <ThemeProvider theme={this.darkTheme} children={children}></ThemeProvider>;
  };
}
