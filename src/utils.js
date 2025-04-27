import { ThemeProvider } from "@emotion/react";
import createTheme from "@mui/material/styles/createTheme";

export class Utils {
  constructor(set, get) {
    this.set = set;
    this.get = get;
  }
}
