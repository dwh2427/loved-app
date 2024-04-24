import Session from "./session";

export default function AuthLayout({ children }) {
  return (
    <>
      <Session>{children}</Session>
    </>
  );
}
