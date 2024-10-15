import Footer from "@/components/footer/Footer";
import Header from "@/components/header/landing";
import { Toaster } from "@/components/ui/toaster";
import StoryblokProvider from "@/components/storyblok/StoryblokProvider";
import Script from 'next/script'
import { Suspense } from "react";

import "@/styles/globals.css";
import { Lato } from "next/font/google";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

storyblokInit({
  accessToken: "k6otqdPfCMgHyEFnpdcxHQtt",
  use: [apiPlugin],
  apiOptions: {
      region: "us"
    },
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata = {
  title: "Loved | Share Your Love",
  description: "share Your Love",
};

export default function RootLayout({ children }) {
  return (
    <StoryblokProvider>
      <html lang="en">
        <head>
          <link rel="shortcut icon" href="/favicon.svg" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js" async />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300..700&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Kalam:wght@300;400;700&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Edu+AU+VIC+WA+NT+Guides:wght@400..700&display=swap" rel="stylesheet" />
        </head>
        <body className={`${lato.className}`}>
          <div className="spacer">
            <div className="sticky stickydiv top-0 bg-white z-[9999]">
              <Header />
            </div>
            <Suspense>
            {children}
            </Suspense>
           
            <Toaster />
            <Footer />
          </div>
        </body>
      </html>
    </StoryblokProvider>
  );
}
