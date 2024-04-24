import Session from "./session";
import DashBoardHeader from "@/components/header/dashboard";

export default function AuthLayout({ children }) {
  return (
    <>
      <DashBoardHeader />
      <Session>{children}</Session>
    </>
  );
}
