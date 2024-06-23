import {
  Container,
  Button,
  Html,
  Font,
  Preview,
  Row,
  Heading,
  Section,
  Text,
  Head,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}
export const VerificationEmail = ({
  username,
  otp,
}: VerificationEmailProps) => {
  return (
    <Html lang="en">
      <Head>
        <title>Verification OTP</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your Verification code :{otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thankyou for registering. Please use the following verification code
            to complete your registration:
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>
            If you didnot request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
};
