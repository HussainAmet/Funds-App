import React from 'react'
import { Header } from './components'
import { Outlet } from 'react-router-dom'
import reactManifest from "react-manifest";
import config from "./config/config";

function App() {
  useEffect(() => {
    const manifestDetails = {
      short_name: config.groupName,
      name: config.groupName,
      icons: [
        {
          src: "favicon.ico",
          sizes: "64x64 32x32 24x24 16x16",
          type: "image/x-icon",
        },
        {
          src: "logo.png",
          type: "image/png",
          sizes: "192x192",
        },
        {
          src: "logo.png",
          type: "image/png",
          sizes: "512x512",
        },
      ],
      start_url: ".",
      display: "standalone",
      theme_color: "#000000",
      background_color: "#ffffff",
    };
    reactManifest.update(manifestDetails, "#update-manifest");
  }, []);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App
