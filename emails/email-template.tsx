import * as React from "react";

interface EmailTemplateProps {
    username: string;
    otp: string;
}

export function EmailTemplate({ username, otp }: EmailTemplateProps) {
    return (
        <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.5" }}>
            <h2>Welcome, {username}!</h2>
            <p>Your One-Time Password (OTP) is:</p>
            <h3 style={{ background: "#f4f4f4", display: "inline-block", padding: "8px 16px", borderRadius: "8px" }}>
                {otp}
            </h3>
            <p>This code will expire in 5 minutes.</p>
        </div>
    );
}
