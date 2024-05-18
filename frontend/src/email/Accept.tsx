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
              </Column>
            </Row>
          </Section>
  
          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={heading}>Confirmation of acceptance</Text>
            <Text style={paragraph}>Dear Tim,</Text>
            <Text style={paragraph}>
              We are very excited to inform you that your application to join Monash Nova Rover
              has been successful. We delighted to offer you a Operation in our team.
            </Text>
          </Section>

          <Section style={paragraphContent}>
            <Text style={paragraph}>
              Please reply to this email <Link href="" style={link}>
                novaroverteam@monash.edu
              </Link>{" "} no later than <b>20/05/2024</b>{" "} to accept
              the position. If you have any question regard the postion or us,
              feel free to reach out. {" "}
            </Text>
          </Section>
  
          <Section style={paragraphContent}>
            <Hr style={hr} />
            <Text style={paragraph}>Kind Regards,</Text>
            <Text style={{ ...paragraph, fontSize: "20px" }}>
              Monash Nova Rover
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
  
  
