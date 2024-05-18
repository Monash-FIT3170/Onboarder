import {
    Body,
    Container,
    Column,
    Head,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
  } from "@react-email/components";
  import * as React from "react";
  

  export const EmailReject = () => (
    <Html>
      <Head />
      <Preview>RejectEmail</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={heading}>Confirmation of rejection</Text>
            <Text style={paragraph}>Dear [NAME],</Text>
            <Text style={paragraph}>
                Thank you for your precious time to apply for a position at [ENG TEAM NAME].
                Unfortunately, your application has been unsuccessful.
            </Text>
          </Section>

          <Section style={paragraphContent}>
            <Text style={paragraph}>
              However we strongly encourage you to apply in our next round of recruitment. 
              Please stayed updated through our social media channels and our {" "}
              <Link href="" style={link}>
                website
              </Link>{" "} for any information regarding future recruitment rounds.
              If you have any question regard to us. 
              Feel free to reach out {" "}
              <Link href="" style={link}>
                example@gmail.com
              </Link>{". "}
            </Text>
          </Section>
  
          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={paragraph}>Kind Regards,</Text>
            <Text style={{ ...paragraph, fontSize: "20px" }}>
              Your Engineering team
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
  
  export default EmailReject;
  
  const main = {
    backgroundColor: "#dbddde",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: "30px auto",
    backgroundColor: "#fff",
    borderRadius: 5,
    overflow: "hidden",
  };
  
  const heading = {
    fontSize: "14px",
    lineHeight: "26px",
    fontWeight: "700",
    color: "#004dcf",
  };
  
  const paragraphContent = {
    padding: "0 40px",
  };
  
  const paragraphList = {
    paddingLeft: 40,
  };
  
  const paragraph = {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#3c4043",
  };
  
  const link = {
    ...paragraph,
    color: "#004dcf",
  };
  
  const hr = {
    borderColor: "#e8eaed",
    margin: "20px 0",
  };
  
  
