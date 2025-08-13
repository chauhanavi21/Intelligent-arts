import React from 'react';
import Banner from '../components/Banner';

const ContactCard = ({ title, lines, icon }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow hover:shadow-lg transition transform hover:-translate-y-1 p-6">
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-2 space-y-1 text-gray-700">
          {lines.map((l, i) => (
            <p key={i}>{l}</p>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ContactUs = () => {
  return (
    <div className="pt-6">
      <div className="px-4 sm:px-[30px] max-w-7xl mx-auto">
        <Banner type="all" limit={1} />
      </div>

      <div className="px-4 sm:px-[30px] max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-[Lato]">Contact Us</h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            We would love to hear from you. Reach out with editorial inquiries, partnerships,
            or general questions, and we will get back to you promptly.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
          <div className="space-y-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <ContactCard
                title="Email"
                lines={[
                  <a key="c" href="mailto:contact@intelligentarts.net" className="text-blue-700">contact@intelligentarts.net</a>,
                  <a key="e" href="mailto:editor@intelligentarts.net" className="text-blue-700">editor@intelligentarts.net</a>
                ]}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 10-8 0 4 4 0 008 0zm6 0a10 10 0 11-20 0 10 10 0 0120 0z" /></svg>}
              />
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
              <ContactCard
                title="Social"
                lines={[
                  <a key="x" href="https://x.com" target="_blank" rel="noreferrer" className="text-blue-700">X/Twitter</a>,
                  <a key="i" href="https://instagram.com" target="_blank" rel="noreferrer" className="text-blue-700">Instagram</a>
                ]}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
              <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-900">
                eBookini™ and AroundUs™ are trademarks of Intelligent Arts Inc.
              </div>
            </div>
          </div>

          {/* Simple contact form (non-functional UI placeholder) */}
          <div className="bg-white rounded-xl border border-gray-100 shadow p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm mb-1">Message</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="How can we help?" />
              </div>
              <button type="button" className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Send
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <p className="text-xs text-gray-500">This form is a visual placeholder. Use the emails provided for direct contact.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
