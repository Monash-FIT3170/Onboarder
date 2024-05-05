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
  

  export const EmailAccept = () => (
    <Html>
      <Head />
      <Preview>AcceptEmail</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Row>
              <Column>
              {/* This will be a top asset of our brand */}
                {/* <Img
                  style={headerBlue}
                  src={``}
                  width="305"
                  height="28"
                  alt="Google Play developers header blue transparent"
                />*/}
              </Column>
            </Row>
          </Section>
  
          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={heading}>Confirmation of acceptance</Text>
            <Text style={paragraph}>Dear [NAME],</Text>
            <Text style={paragraph}>
              We are very excited to inform you that your application to join [ENG TEAM NAME] 
              has been successful. We delighted to offer you a [POSTION NAME] in our team.
            </Text>
          </Section>

          <Section style={paragraphContent}>
            <Text style={paragraph}>
              Please reply to this email no later than <b>DD/MM/YYY</b>{" "} to accept
              the position. If you have any question regard the postion or us.
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
  
  export default EmailAccept;
  
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
  const paragraphList = {
    paddingLeft: 40,
  };
  
  
