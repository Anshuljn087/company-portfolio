import Image from "next/image";

export default function ContactPage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative h-[340px] flex items-center justify-center text-center">
        <Image
          src="https://images.unsplash.com/photo-1553877522-43269d4ea984"
          alt="contact hero"
          fill
          className="object-cover opacity-30"
        />

        <h1 className="relative text-5xl font-bold text-[var(--primary)]">
          Contact Gangwal IT Services
        </h1>
      </section>

      {/* FORM */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <form
          action="/api/contact"
          method="POST"
          className="
      space-y-8
      bg-white
      p-10
      rounded-2xl
      border border-gray-200
      shadow-lg
    "
        >
          {/* EMAIL */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Email Address *
            </label>

            <input
              name="email"
              required
              type="email"
              placeholder="you@company.com"
              className="
          w-full p-4 rounded-lg
          bg-white
          border border-gray-300
          text-gray-900
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--primary)]
          focus:border-[var(--primary)]
        "
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Contact Number
            </label>

            <input
              name="phone"
              type="text"
              placeholder="+91 9876543210"
              className="
          w-full p-4 rounded-lg
          bg-white
          border border-gray-300
          text-gray-900
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--primary)]
          focus:border-[var(--primary)]
        "
            />
          </div>

          {/* MESSAGE */}
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Message *
            </label>

            <textarea
              name="message"
              required
              rows={6}
              placeholder="Tell us about your project..."
              className="
          w-full p-4 rounded-lg
          bg-white
          border border-gray-300
          text-gray-900
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--primary)]
          focus:border-[var(--primary)]
        "
            />
          </div>

          <button
            className="
        w-full py-4 rounded-xl
        border-2 border-[var(--primary)]
        text-[var(--primary)]
        uppercase font-semibold tracking-wide

        transition duration-300

        hover:bg-[var(--primary)]
        hover:text-white
        hover:shadow-lg

        active:scale-95
      "
          >
            SEND MESSAGE
          </button>
        </form>
      </section>
    </main>
  );
}
