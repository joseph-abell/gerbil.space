import React from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { styleReset } from "react95";
// pick a theme of your choice
import original from "react95/dist/themes/original";
// original Windows95 font (optionally)
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import Wrapper from "./components/Wrapper";
import NewUrl from "./components/NewUrl";
import Redirect from "./components/Redirect";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body {
    font-family: 'ms_sans_serif';
  }
`;

const App = () => (
  <>
    <GlobalStyles />
    <ThemeProvider theme={original}>
      <Wrapper>
        <Router>
          <Routes>
            <Route path="/" element={<NewUrl />} />
            <Route path="*" element={<Redirect />} />
          </Routes>
        </Router>
      </Wrapper>
    </ThemeProvider>
  </>
);

export default App;
