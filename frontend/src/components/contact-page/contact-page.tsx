import { useState } from 'react';
import {
  useSendContactEmailSendContactEmailPost,
  type ContactEmailCreateRequest,
  type ContactEmailResponse,
} from '../../api';

const ContactPage = () => {
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { mutate } = useSendContactEmailSendContactEmailPost();

  const callApi = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    const body: ContactEmailCreateRequest = {
      senderName: fullName,
      senderAddress: emailAddress,
      emailSubject: subject,
      emailContent: emailBody,
    };
    mutate(
      { data: body },
      {
        onSuccess: (response: ContactEmailResponse) => {
          console.log('API response:', response);
          setSuccessMessage(
            'Your message has been sent successfully! Thank you for contacting us.'
          );
        },
        onError: (error: any) => {
          console.error('API error:', error);
          setErrorMessage(
            'An error occurred while sending your message. Please try again later.'
          );
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  return (
    <div>
      <h1 className="text-violet-500 text-2xl">Contact Us</h1>
      <p>We would love to hear from you!</p>
      <label className="label flex-row justify-start">
        <span className="label-text px-2">Full Name: </span>
        <input
          type="text"
          className="input input-bordered w-full input-xs items-start"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </label>

      <label className="label flex-row justify-start">
        <span className="label-text px-2">Email Address: </span>
        <input
          type="email"
          className="input input-bordered w-full input-xs"
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          required
        />
      </label>

      <label className="label flex-row justify-start">
        <span className="label-text px-2">Subject: </span>
        <input
          type="text"
          className="input input-bordered w-full input-xs"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </label>

      <textarea
        className="textarea textarea-bordered textarea-lg w-full my-2"
        placeholder="Enter message here..."
        value={emailBody}
        onChange={(e) => setEmailBody(e.target.value)}
        required
      />

      {!loading ? (
        <button className="btn btn-primary" onClick={callApi}>
          Send
        </button>
      ) : (
        <button
          className="btn btn-disabled bg-primary text-white"
          aria-busy="true"
          disabled
        >
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Sending...
        </button>
      )}

      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      {successMessage && (
        <p className="text-green-500 mt-2">{successMessage}</p>
      )}
    </div>
  );
};

export default ContactPage;
