import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

interface InterviewInvitationProps {
    companyName?: string;
    companyLogo?: string;
    hrMessage?: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://your-domain.com"; // Replace with your actual domain

export const InterviewInvitation = ({
    companyName = "{{COMPANY_NAME}}",
    companyLogo,
    hrMessage = "{{HR_MESSAGE}}",
}: InterviewInvitationProps) => {
    return (
        <Html>
            <Head />
            <Preview>Lời mời phỏng vấn tại {companyName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        {/* <Img
                            src={companyLogo || `https://ui-avatars.com/api/?name=${companyName}&background=0D8ABC&color=fff&size=80`}
                            width="80"
                            height="80"
                            alt={companyName}
                            style={logo}
                        /> */}
                        <Heading style={companyHeading}>{companyName}</Heading>
                    </Section>

                    {/* HR Message Content - Taking full control */}
                    {hrMessage && (
                        <Section style={messageBoxSimple}>
                            <Text style={messageText} dangerouslySetInnerHTML={{ __html: hrMessage }} />
                        </Section>
                    )}

                    <Hr style={hr} />

                    {/* Footer */}
                    <Text style={footer}>
                        Trân trọng,<br />
                        <strong>{companyName}</strong> Recruitment Team
                    </Text>
                    <Text style={footerLegal}>
                        Email này được gửi tự động từ hệ thống tuyển dụng của {companyName}. Vui lòng không trả lời vào địa chỉ noreply.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

export default InterviewInvitation;

// Styles
const main = {
    backgroundColor: "#f4f7f6",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "40px auto", // Increased top/bottom margin for outer spacing
    padding: "40px 40px", // Increased padding inside container
    maxWidth: "600px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
};

const header = {
    marginBottom: "40px", // Increased spacing below header
    textAlign: "center" as const,
};

const logo = {
    borderRadius: "50%",
    margin: "0 auto 20px", // Increased spacing below logo
    objectFit: "cover" as const,
};

const companyHeading = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
    textTransform: "uppercase" as const
}

const paragraph = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#4a5568",
    margin: "0 0 20px",
};

const detailsContainer = {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px",
};

const detailsHeading = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2d3748",
    margin: "0 0 10px",
};

const detailsDivider = {
    borderColor: "#e2e8f0",
    margin: "10px 0 15px"
};

const row = {
    marginBottom: "12px",
    display: "flex",
    flexDirection: "row" as const, // Force flex row
};

const label = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#718096",
    width: "120px",
    margin: "0",
    display: "inline-block", // Fallback
};

const value = {
    fontSize: "15px",
    color: "#2d3748",
    margin: "0",
    fontWeight: "500",
    display: "inline-block", // Fallback
};

const valueLink = {
    ...value,
    color: "#3182ce",
    textDecoration: "underline",
}

const messageBoxSimple = {
    padding: "0",
    marginBottom: "24px",
};

const messageText = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#2d3748",
    margin: "0"
};

const btnContainer = {
    textAlign: "center" as const,
    marginBottom: "15px",
};

const button = {
    backgroundColor: "#3182ce",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 28px",
    boxShadow: "0 2px 4px rgba(49, 130, 206, 0.3)",
};

const helpText = {
    textAlign: "center" as const,
    fontSize: "13px",
    color: "#718096",
    margin: "0 0 30px"
}

const hr = {
    borderColor: "#e2e8f0",
    margin: "30px 0",
};

const footer = {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#4a5568",
};

const footerLinks = {
    margin: "20px 0",
    fontSize: "14px",
    color: "#718096",
};

const link = {
    color: "#3182ce",
    textDecoration: "none",
    margin: "0 5px"
};

const footerLegal = {
    fontSize: "12px",
    lineHeight: "18px",
    color: "#a0aec0",
    marginTop: "20px"
};
