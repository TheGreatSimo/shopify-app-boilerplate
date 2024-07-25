import { Page, Text, Layout, TextField, Button } from '@shopify/polaris';
import { useState } from 'react';


const Contact = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);

    const response = await fetch("/app/sendemail", {
      method: "post",
      body: formData,
    });

    const result = await response.json();
    setResponseMessage(result.success ? "Email sent successfully!" : "Failed to send email.");
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Text variant='heading2xl' as="h1" alignment='center'>Contact us</Text>
        </Layout.Section>
        <Layout.Section>
          <TextField 
            label="Name"
            value={name}
            type="text"
            autoComplete='on'
            onChange={(value:string) => setName(value)}
          />
          <TextField 
            label="Email"
            value={email}
            type="email"
            autoComplete='on'
            onChange={(value) => setEmail(value)}
          />
          <TextField 
            label="Message"
            type="text"
            multiline={6}
            autoComplete='on'
            value={message}
            onChange={(value) => setMessage(value)}
          />
        </Layout.Section>

        <Layout.Section>
          <Button variant='primary' fullWidth={true} size={'large'}  onClick={handleSubmit}>Submit</Button>
        </Layout.Section>

        {responseMessage && (
          <Layout.Section>
            <div className='center'>
              <Text variant='headingMd'as="p" >{responseMessage}</Text>
            </div>
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
};

export default Contact;