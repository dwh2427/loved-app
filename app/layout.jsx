import Footer from "@/components/footer/Footer";
import Header from "@/components/header/landing";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { Lato } from "next/font/google";


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
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body className={`${lato.className}`}>
        <div className="spacer">
          <div className="sticky top-0 bg-white z-[9999]">
            <Header />
          </div>
          {children}
          <Toaster />
          {<Footer />}
        </div>
      </body>
    </html>
  );
}
