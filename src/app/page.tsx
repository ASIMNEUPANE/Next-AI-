import Image from "next/image";
import { VerificationEmail } from "../../emails/VerificationEmail";

export default function Home() {
  return (
    <>
      <VerificationEmail username="Asimneupane" otp="32423" />
    </>
  );
}
