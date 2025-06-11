import React from 'react';

interface EmailTemplateProps {
    firstName: string;
    link: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    link
}) => (
    <div className="font-sans max-w-[600px] mx-auto p-5 bg-white">
        <h1 className="text-2xl text-gray-900 mb-5">
            Welcome, {firstName}!
        </h1>

        <p className="text-base text-gray-600 leading-relaxed mb-5">
            You have been invited to complete a Leadership Feedback Survey. This feedback is valuable for our team&apos;s growth and development.
        </p>

        <p className="text-base text-gray-600 leading-relaxed mb-5">
            Please click the button below to access the survey:
        </p>

        <a
            href={link}
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md text-base font-semibold no-underline mb-5 hover:bg-indigo-700 transition-colors"
        >
            Access Survey
        </a>

        <p className="text-sm text-gray-600 leading-relaxed mt-5">
            If the button above doesn&apos;t work, you can copy and paste this link into your browser:
        </p>

        <p className="text-sm text-gray-600 break-all">
            {link}
        </p>
    </div>
);