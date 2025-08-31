'use client';
import React, { useState, useEffect } from 'react';
import Preloader from '../components/Preloader';
import { motion } from 'framer-motion';


const fadeUp = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const About = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  const whyWeExist = [
    "Because 'I'll study later' becomes 'OMG, exam is tomorrow!'",
    "Because sometimes textbooks feel like they're written in elvish",
    "Because that one friend who explains everything better than the lecturer deserves a platform",
    "Because passing exams shouldn't require selling your soul to the coffee devil " 
  ];

  const howItWorks = [
    "Find your subject",
    "Watch videos made by students who've been in your shoes",
    "Have that 'Ohhhhhhh, now I get it!' moment",
    "Ace that exam!",
    "Maybe become a Kuppi hero yourself!"
  ];

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Hero Section */}
        <Section>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 md:p-10 rounded-2xl shadow-xl transform hover:scale-[1.02] transition-all duration-300 backdrop-blur-lg border border-white/20">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text">
                Welcome to Kuppi Hub! 🎓
              </h1>
              <p className="text-blue-100 text-base sm:text-lg md:text-xl leading-relaxed">
                When lectures feel like they're in alien language and your notes look like ancient hieroglyphics,
                Kuppi Hub is here to save your semester! We're students helping students, because let's face it -
                sometimes you need that "Wait, what?!" moment explained by someone who just survived the same confusion.
              </p>
            </div>
          </motion.div>
        </Section>

        {/* What's Kuppi & Why We Exist */}
        <div className="grid gap-8 md:grid-cols-2">
          <Section>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:bg-white/90"
            >
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3 transform hover:scale-110 transition-transform duration-300">🤔</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  What&apos;s a Kuppi?
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Imagine this: It&apos;s 2 AM, you&apos;ve had your fifth cup of coffee, finals are tomorrow, and that one
                topic still makes zero sense. That&apos;s where Kuppi comes in! It&apos;s that magical study session where
                students who&apos;ve cracked the code share their wisdom with those still staring at the matrix.
              </p>
            </motion.div>
          </Section>

          <Section>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 hover:bg-white/90"
            >
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3 transform hover:scale-110 transition-transform duration-300">💡</span>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Why We Exist
                </h2>
              </div>
              <ul className="text-gray-600 space-y-4">
                {whyWeExist.map((item, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="mr-3 text-blue-500 group-hover:text-indigo-600 transition-colors duration-300">•</span>
                    <span className="leading-relaxed group-hover:text-gray-900 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </Section>
        </div>

        {/* How It Works */}
        <Section>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-blue-200 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/100"
          >
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3 transform hover:scale-110 transition-transform duration-300">🚀</span>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                How It Works
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative p-6 bg-white/50 rounded-lg hover:bg-white/90 transition-all duration-300 border border-white/50 hover:shadow-md group"
                >
                  <div className="text-blue-600 font-bold mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                    Step {index + 1}
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* Join Section */}
        <Section>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-xl transform hover:scale-[1.02] transition-all duration-300 border border-white/20"
          >
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3 transform hover:scale-110 transition-transform duration-300">🤝</span>
              <h2 className="text-2xl font-bold">Join The Kuppi Family!</h2>
            </div>
            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
              Whether you're here because you're lost in lectures or because you want to help others find their way -
              welcome to the family! Remember: every genius started by being confused about something.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
              <p className="text-white font-medium mb-2">Got questions? Need help? Want to share your knowledge?</p>
              <p className="text-blue-100">Drop us a line at: Kuppihub@CSE23.org</p>
              <p className="text-blue-100 text-sm mt-4 italic">
                PS: We also accept memes about university life. Just saying... 😉
              </p>
            </div>
          </motion.div>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ children }) => (
  <div className="w-full">{children}</div>
);

export default About;