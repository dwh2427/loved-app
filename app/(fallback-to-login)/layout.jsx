import Session from "./session";

export default function FallbackToLoginLayout({ children }) {
  return (
    <>
      {/* <DashBoardHeader /> */}
      <Session>{children}</Session>
    </>
  );
}
