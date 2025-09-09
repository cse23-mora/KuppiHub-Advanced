'use client';

import { motion } from 'framer-motion';

export default function AddKuppi() {
  const formUrls = {
    addKuppi: 'https://docs.google.com/forms/d/e/1FAIpQLSezyJsO9tl37tzieXLGzohTf3Oc9mJ3lCaihWG6KzP5RvzAyA/viewform?usp=header?hl=en',
    studentKuppi: 'https://docs.google.com/forms/d/e/1FAIpQLSdEwUJ5dGwtjryLkOHoX27Vhal0zTvxoLbQ9Q1KcR7W_q3dlg/viewform?hl=en',
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="shadow-xl transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-lg border border-white/20 p-8 rounded-2xl">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 tracking-tight bg-clip-text text-center">
            Add Kuppi or Materials! 🎓
          </h3>
          <p className="text-gray-700 text-center">
            Choose the action you want to perform. Click one of the buttons
            below to open the relevant Google Form.
          </p>
        </div>
      </motion.div>

      {/* Buttons Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-10 flex flex-col sm:flex-row justify-center gap-6"
      >
        <a
          href={formUrls.addKuppi}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-full font-bold text-white bg-green-500 shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105 text-center"
        >
          Add New Kuppi or Materials
        </a>

        <a
          href={formUrls.studentKuppi}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-full font-bold text-white bg-blue-500 shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105 text-center"
        >
          Add Students Who Teach Kuppi
        </a>
      </motion.div>

      {/* Info Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-12 bg-gray-50/45 border border-gray-200 shadow-md p-6 rounded-xl"
      >
        <h4 className="text-xl font-semibold mb-4 text-center">
          📢 How to Submit Your Kuppi
        </h4>
        <p className="text-gray-700 leading-relaxed">
          👉 Upload your kuppi video or materials to our official Telegram bot:
          <a
            href="https://t.me/KuppihubBot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold ml-1"
          >
            @KuppihubBot
          </a>
          . If you have more than 2 files, you can zip them before uploading.
          The bot will send you a Telegram link for your files. Use that link
          when filling out the Google Form.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          🎥 If you publish your kuppi sessions on YouTube, you can also provide
          your YouTube link in the form.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          🧑‍🎓 Students who teach kuppi sessions can create a profile in Kuppi
          Hub. We use your <strong>index number</strong> to identify your kuppis
          (this will <u>never</u> be exposed publicly). It is only used to link
          your kuppis with your profile.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          ✅ After submission, our team will review and approve your entry. If
          something irrelevant or duplicated is found, please contact us at{' '}
          <a
            href="mailto:kuppihub@cse23.org"
            className="text-blue-600 font-semibold"
          >
            kuppihub@cse23.org
          </a>{' '}
          or via our contact form, and we will take action.
        </p>
      </motion.div>

      {/* Contribution Invitation */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-12  text-gray-700 shadow-lg p-8 rounded-2xl text-center"
      >
        <h4 className="text-2xl font-bold mb-4">
          🌟 Be Part of the KuppiHub Community!
        </h4>
        <p className="text-lg leading-relaxed">
          By contributing your kuppis, materials, or even your time as a student
          mentor, you’re not just helping your friends—you’re building a resource
          for the <strong>future generations</strong> of students. 🚀
        </p>
        <p className="mt-4 text-base">
          Let’s grow together and make learning easier, one kuppi at a time. 💙
        </p>
      </motion.div>
    </div>
  );
}
