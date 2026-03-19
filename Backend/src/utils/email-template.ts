export const getSelectedEmailContext = (candidateName: string, jobRole: string) => {
    return `<p>Dear ${candidateName},</p>

        <p>We are pleased to inform you that you have been successfully <strong>selected<strong> for the position of <strong>${jobRole}</strong>.</p>

        <p>Congratulations on this achievement! Your qualifications and performance stood out, and we are excited about the potential you bring to our team.</p>

        <p>Our recruitment team will contact you shortly with further details regarding the next steps in the process. Please keep an eye on your email for future communication.</p>

        <p>If you have any questions in the meantime, feel free to reach out.</p>

        <p>Best regards,<br/>
        Smart Recruiter Team</p>`;
};

export const getRejectedEmailContext = (candidateName: string, jobRole: string) => {
    return `<p>Dear ${candidateName},</p>

        <p>Thank you for your interest in the position of <strong>${jobRole}</strong> and for taking the time to go through our selection process.</p>

        <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>

        <p>This decision was not easy, as we received applications from many qualified candidates. We encourage you to apply for future opportunities that match your skills and experience.</p>

        <p>We sincerely appreciate your effort and interest in being a part of our team, and we wish you continued success in your career.</p>

        <p>Best regards,<br/>
        Smart Recruiter Team</p>`;
};