'use client'
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/landing";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { auth } from '@/firebase/config';
import Picture from "@/public/image.png";
import localFont from "next/font/local";
import Image from "next/image";
import { useEffect, useState } from "react";
const Iowan = localFont({
  src: "../fonts/iowan-old.ttf",
  display: "swap",
});

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User is signed in
        setUser(authUser);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  console.log(user)
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1495px] px-5 xl:px-0">
        <Card className="mt-6 flex flex-col justify-center gap-y-[20.81px] rounded-[30px] border-0 bg-[#00F0FF] py-[20.81px] sm:mt-10 xl:mt-[50px] xl:h-[650.39px] xl:py-0">
          <div className="mx-auto w-56 sm:w-64 md:w-72 xl:w-[341px]">
            <Image
              src={Picture}
              alt="Image"
              className="h-auto w-full"
              sizes="100vw"
            />
          </div>
          <CardTitle
            className={`${Iowan.className} mx-auto w-3/4 py-0 text-center text-5xl sm:w-1/2 md:text-6xl xl:h-[180px] xl:w-[743px] xl:text-[80px] xl:font-[900] xl:leading-[90px]`}
          >
            A Forever Place for Loved Ones
          </CardTitle>
          <p className="mx-auto w-3/4 py-0 text-center sm:w-2/3 md:w-1/2 xl:h-[75px] xl:w-[639px] xl:text-lg xl:font-[600] xl:leading-[25px]">
            At Loved, we understand the profound impact that both births and
            deaths have on our lives. Our platform provides a space to honor and
            celebrate these significant moments, creating lasting memorials that
            cherish the journey of life.
          </p>
          <Button
            variant={"default"}
            className="h-[62px] w-[215px] self-center rounded-[100px] bg-[#FF007A] px-[40px] py-[20px] text-[18px] font-[900] leading-[22px] text-[#FEFFF8] hover:bg-[#FF007A] focus:bg-[#FF007A] focus-visible:ring-0 focus-visible:ring-[#FF007A] focus-visible:ring-offset-0 dark:bg-violet-600 dark:text-gray-50"
          >
            Start Loved page
          </Button>
        </Card>
      </main>
      <Footer />
    </>
  );
}
