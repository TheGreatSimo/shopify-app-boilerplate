import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

interface FormData {
  get(name: string): FormDataEntryValue | null;
}

interface Request {
  formData(): Promise<FormData>;
}

export const action = async ({ request }: { request: Request }): Promise<Response> => {
  console.log("Received the request");

  const formData = await request.formData();
  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const message = formData.get("message") as string | null;

  console.log(name, email, message);

  // Ensure that environment variables are set and not null
  const userEmail = process.env.email;
  const userPass = process.env.pass;

  if (!userEmail || !userPass) {
    throw new Error("Environment variables for email and password are not set.");
  }

  const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: userEmail,
      pass: userPass,
    },
  });

  // Email to yourself
  const mailOptionsToSelf: SendMailOptions = {
    from: email || 'no-reply@example.com', 
    to: userEmail,
    subject: `Message from ${name} for app0`,
    html: `
      <body style="background-color: #949494; border-radius: 30px;">
        <h1 style="text-align: center;">Contact Request for app0</h1>
        <h3 style="text-align: center;">Sent by ${name}</h3>
        <h4 style="text-align: center;">${email}</h4>
        <p style="text-align: center; padding-top: 50px;">${message}</p>
      </body>
    `,
  };

  // Casual acknowledgment email to the user
  const mailOptionsToUser: SendMailOptions = {
    from: userEmail, 
    to: email as string,
    subject: 'Thanks for Reaching Out!',
    html: `
      <body style="background-color: #f5f5f5; border-radius: 10px;">
        <p>Hey ${name},</p>
        <p>Thank you for using my app Boilerplate! I'll respond to you as quickly as I can.</p>
        <p>Cheers,</p>
        <p>Mohamed </p>
      </body>
    `,
  };

  try {
    // Send email to yourself
    await transporter.sendMail(mailOptionsToSelf);

    // Send acknowledgment email to the user
    if (email) {
      await transporter.sendMail(mailOptionsToUser);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), { status: 500 });
  }
};
