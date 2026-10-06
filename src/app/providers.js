"use client";
import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

const theme = createTheme({
  direction: "rtl",
  palette: { primary: { main: "#c27b7b" } },
  typography: { fontFamily: "inherit" },
  shape: { borderRadius: 10 },
});

export default function Providers({ children }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: "muirtl", stylisPlugins: [prefixer, rtlPlugin] });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) inserted.push(serialized.name);
      return prevInsert(...args);
    };
    const flush = () => {
      const prev = inserted;
      inserted = [];
      return prev;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (!names.length) return null;
    let styles = "";
    for (const name of names) styles += cache.inserted[name];
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}