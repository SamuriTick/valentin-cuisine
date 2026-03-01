import { generateSEOMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return generateSEOMetadata({
    title: "GDPR Policy",
    description: "West Acton Community Centre's GDPR and data protection policy. Learn how we collect, use, and protect your personal information.",
    url: "/gdpr",
    keywords: [
      "GDPR",
      "data protection",
      "privacy policy",
      "personal data",
      "data rights",
      "cookies"
    ]
  });
}

export default function GDPRPolicy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-heading font-bold text-primary-600 mb-8">
            GDPR & Privacy Policy
          </h1>

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="mb-4">
                West Acton Community Centre (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your personal data and respecting your privacy. This policy explains how we collect, use, and safeguard your information in compliance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Controller</h2>
              <p className="mb-4">
                West Acton Community Centre is the data controller responsible for your personal data. If you have any questions about this policy or our data practices, please contact us using our contact form.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="mb-4">We may collect and process the following personal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Contact information:</strong> Name, email address, phone number when you submit enquiries through our contact form</li>
                <li><strong>Booking information:</strong> Details provided when booking facilities or registering for programmes</li>
                <li><strong>Technical data:</strong> IP address, browser type, and device information collected automatically when you visit our website</li>
                <li><strong>Usage data:</strong> Information about how you use our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use your personal data for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To respond to your enquiries and provide information about our services</li>
                <li>To process facility bookings and programme registrations</li>
                <li>To send you relevant updates about our community centre (with your consent)</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Basis for Processing</h2>
              <p className="mb-4">We process your personal data on the following legal bases:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consent:</strong> Where you have given clear consent for us to process your data for a specific purpose</li>
                <li><strong>Contract:</strong> Where processing is necessary for a contract with you (e.g., facility bookings)</li>
                <li><strong>Legitimate interests:</strong> Where processing is necessary for our legitimate interests and does not override your rights</li>
                <li><strong>Legal obligation:</strong> Where we need to comply with a legal requirement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="mb-4">
                We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected. Contact form submissions are typically retained for 2 years. Booking records may be retained for up to 7 years for accounting purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="mb-4">Under UK GDPR, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Right of access:</strong> Request a copy of your personal data</li>
                <li><strong>Right to rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to erasure:</strong> Request deletion of your data in certain circumstances</li>
                <li><strong>Right to restrict processing:</strong> Request limitation of how we use your data</li>
                <li><strong>Right to data portability:</strong> Request transfer of your data to another organisation</li>
                <li><strong>Right to object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time where processing is based on consent</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us using our contact form. We will respond to your request within one month.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies</h2>
              <p className="mb-4">
                Our website uses essential cookies to ensure proper functionality. We may also use analytics cookies to understand how visitors interact with our site. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="mb-4">
                We may use third-party services to help operate our website and services. These providers are bound by contractual obligations to keep your data secure and use it only for specified purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="mb-4">
                We may update this policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Complaints</h2>
              <p className="mb-4">
                If you are not satisfied with how we handle your personal data, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO), the UK supervisory authority for data protection issues.
              </p>
              <p>
                <strong>ICO Website:</strong>{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  www.ico.org.uk
                </a>
              </p>
            </section>

            <section className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
