import Footer from "@/components/footer/Footer";
import Header from "@/components/header/landing";
import { Toaster } from "@/components/ui/toaster";
import StoryblokProvider from "@/components/storyblok/StoryblokProvider";
import Script from 'next/script'

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

          <script src="assets/js/fabric.min.js" async />
        </head>
        <body className={`${lato.className}`}>
          <div className="spacer">
            <div className="sticky stickydiv top-0 bg-white z-[9999]">
              <Header />
            </div>
            {children}
            <Toaster />
            <Footer />
          </div>
        </body>
      </html>
    </StoryblokProvider>
  );
}
