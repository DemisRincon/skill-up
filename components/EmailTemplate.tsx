interface EmailTemplateProps {
    firstName: string;
    link: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    link
}) => (
    <div style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#ffffff',
    }}>
        <h1 style={{
            color: '#333333',
            fontSize: '24px',
            marginBottom: '20px'
        }}>Welcome, {firstName}!</h1>

        <p style={{
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '20px'
        }}>
            You have been invited to complete a Leadership Feedback Survey. This feedback is valuable for our team's growth and development.
        </p>

        <p style={{
            color: '#666666',
            fontSize: '16px',
            lineHeight: '1.5',
            marginBottom: '20px'
        }}>
            Please click the button below to access the survey:
        </p>

        <a href={link} style={{
            display: 'inline-block',
            backgroundColor: '#0070f3',
            color: '#ffffff',
            padding: '12px 24px',
            textDecoration: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '20px'
        }}>
            Access Survey
        </a>

        <p style={{
            color: '#666666',
            fontSize: '14px',
            lineHeight: '1.5',
            marginTop: '20px'
        }}>
            If the button above doesn't work, you can copy and paste this link into your browser:
        </p>

        <p style={{
            color: '#666666',
            fontSize: '14px',
            wordBreak: 'break-all'
        }}>
            {link}
        </p>
    </div>
);