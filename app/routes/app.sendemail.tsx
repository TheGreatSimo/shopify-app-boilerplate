import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

interface FormData {
  get(name: string): FormDataEntryValue | null;
}

// Define the type of the `request` parameter
interface Request {
  formData(): Promise<FormData>;
}

export const action = async ({ request }: { request: Request }): Promise<Response> => {
  console.log("we got the request");

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

  const mailOptions: SendMailOptions = {
    from: email || 'no-reply@example.com', // Fallback if email is null
    to: userEmail,
    subject: `Message App5 ${name}`,
    html: `
      <body style="background-color: #949494;border-radius: 30px;">
        <h1 style="text-align: center;">app5</h1>
        <h3 style="text-align: center;">Sent by ${name}</h3>
        <h4 style="text-align: center;">${email}</h4>
        <p style="text-align: center; padding-top: 50px;">${message}</p>
      </body>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), { status: 500 });
  }
};
