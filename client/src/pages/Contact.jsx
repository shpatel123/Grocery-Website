import React from "react";

const Contact = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-10">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
        <p className="text-gray-600">We'd love to hear from you! 👋</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <form className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 rounded px-4 py-2 outline-primary"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 rounded px-4 py-2 outline-primary"
            required
          />
          <textarea
            rows="5"
            placeholder="Your Message"
            className="border border-gray-300 rounded px-4 py-2 outline-primary resize-none"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull text-white py-2 rounded-full transition"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info / Map */}
        <div className="flex flex-col gap-6 text-sm text-gray-700">
          <div>
            <h3 className="text-lg font-semibold mb-2">Reach Us At:</h3>
            <p>📍 123 Green Street, Ahmedabad, India</p>
            <p>📧 contact@greencart.com</p>
            <p>📞 +91 98765 43210</p>
          </div>
          <iframe
            title="Google Map"
            className="rounded-md shadow h-64 w-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.1459462797894!2d72.5313525751097!3d23.08696287912974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f21ec5df01%3A0xabcde12345678901!2sAhmedabad!5e0!3m2!1sen!2sin!4v1625315789745!5m2!1sen!2sin"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
