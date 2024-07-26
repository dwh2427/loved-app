import Session from "./session";

export default function FallbackToDashboard({ children }) {
  return (
    <>
      <Session>{children}</Session>
    </>
  );
}
