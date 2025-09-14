'use client';
import React, { useState, useEffect } from 'react';
import Preloader from '../components/Preloader';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const FAQ = () => {
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader />;

  const faqCategories = [
    {
      title: "Getting Started 🚀",
      icon: "🌟",
      faqs: [
        {
          question: "What is Kuppi Hub exactly?",
          answer: "Kuppi Hub is a 100% free, open-source educational platform created by University of Moratuwa CSE23 batch students for ALL Sri Lankan university students. It's where students share Kuppi sessions (study videos), notes, books, and model questions to help each other succeed academically. Think of it as your digital study group that never sleeps!"
        },
        {
          question: "Do I need to create an account or login?",
          answer: "Nope! That's the beauty of Kuppi Hub - no registration, no login, no passwords to remember. Just visit, find what you need, and start learning. We believe education should be accessible without barriers."
        },
        {
          question: "Is it really completely free?",
          answer: "100% FREE! No hidden costs, no premium features, no subscriptions. The domain costs are covered by our CSE23 batch, and we use free hosting services. Our mission is to make quality education accessible to every Sri Lankan student, regardless of their financial situation."
        },
        {
          question: "What devices can I use to access Kuppi Hub?",
          answer: "You can access Kuppi Hub from anywhere! We have a web platform for your laptop/desktop, a mobile app (APK available for download), and everything is mobile-responsive. Study on the bus, in the library, or under your blanket at 2 AM - we've got you covered!"
        }
      ]
    },
    {
      title: "Content & Subjects 📚",
      icon: "🎓",
      faqs: [
        {
          question: "Which subjects and faculties are covered?",
          answer: "ALL faculties of University of Moratuwa and beyond! We cover Engineering, Medicine, Business, Architecture, IT, and more. Our content is organized by Faculty → Department → Semester → Module, making it super easy to find exactly what you need for your specific course."
        },
        {
          question: "What types of content can I find?",
          answer: "We've got everything a student needs: 🎥 Kuppi videos (student-taught explanations), 📚 Study notes and summaries, 📖 Recommended textbooks and references, ❓ Model questions and past papers, 💡 Quick tips and tricks from students who've been there!"
        },
        {
          question: "Are materials available in different languages?",
          answer: "Yes! We support Sinhala, Tamil, and English content. Students can upload materials in any of these languages because we believe language shouldn't be a barrier to learning. You'll find a diverse mix of content that caters to all Sri Lankan students."
        },
        {
          question: "How current and reliable is the content?",
          answer: "Our content is created and shared by students who have recently taken these courses, so it's current and relevant. We have a review process where our team checks submissions for quality and relevance. If you find outdated or incorrect content, just contact us at kuppihub@cse23.org!"
        }
      ]
    },
    {
      title: "Contributing Content 🤝",
      icon: "📤",
      faqs: [
        {
          question: "How can I share my Kuppi videos or materials?",
          answer: "Super easy! 1️⃣ Upload your content to @KuppihubBot on Telegram (if you have 2+ files, zip them first), 2️⃣ The bot gives you a Telegram link, 3️⃣ Use that link when filling our Google Form, 4️⃣ Alternatively, if you have YouTube videos, just provide the YouTube link in the form. Our team reviews and publishes approved content!"
        },
        {
          question: "What if I want to become a recognized Kuppi teacher?",
          answer: "We'd love to have you! You can create a teacher profile through our 'Add Students Who Teach Kuppi' form. We use your index number to link your content with your profile (this is never shown publicly - it's just for organization). Build your reputation as a Kuppi hero in the community!"
        },
        {
          question: "Can I contribute to the platform's development?",
          answer: "Absolutely! We're open source on GitHub. If you're tech-savvy, fork our repository, add features, fix bugs, or improve the UI, then submit a pull request. Whether you're a coding ninja or a design wizard, there's a place for your skills in making Kuppi Hub even better!"
        },
        {
          question: "What types of content are NOT allowed?",
          answer: "We maintain high standards! We don't accept: irrelevant content, duplicate materials, copyrighted content without permission, or anything inappropriate for an educational platform. Our team reviews everything, and if something doesn't fit, we'll reach out to discuss it."
        }
      ]
    },
    {
      title: "Technical & Access 💻",
      icon: "⚙️",
      faqs: [
        {
          question: "How do I download the mobile app?",
          answer: "You can download our APK directly from our website or GitHub repository. Since we're focused on accessibility, we provide the APK for direct installation rather than going through app stores. Just enable 'Unknown Sources' in your Android settings and install!"
        },
        {
          question: "Is the platform open source?",
          answer: "Yes! Our code is available on GitHub for anyone to see, use, and contribute to. This transparency ensures the platform remains free and community-driven. You can fork it, suggest improvements, or even use it to create similar platforms for other communities!"
        },
        {
          question: "What if the platform is slow or has technical issues?",
          answer: "We use free hosting services, so sometimes there might be slower loading times during peak hours. If you experience persistent issues, please report them to kuppihub@cse23.org. We're constantly working to improve performance and user experience!"
        },
        {
          question: "Can I access content offline?",
          answer: "Currently, you need an internet connection to access content. However, you can download materials like PDFs and notes for offline viewing. We're exploring offline capabilities for future updates - it's on our roadmap!"
        }
      ]
    },
    {
      title: "Community & Support 🌍",
      icon: "🤗",
      faqs: [
        {
          question: "Who runs Kuppi Hub?",
          answer: "Kuppi Hub is created and maintained by the Computer Science and Engineering 2023 batch of University of Moratuwa. We're students just like you who understand the struggles of university life and want to make it easier for everyone!"
        },
        {
          question: "How can I get help or report issues?",
          answer: "We're here to help! Contact us at: 📧 kuppihub@cse23.org, 🤖 @KuppihubBot on Telegram, 📝 Through our website's contact form. Whether you have technical issues, content questions, or suggestions, we'd love to hear from you!"
        },
        {
          question: "Can students from other universities use Kuppi Hub?",
          answer: "Of course! While we started with University of Moratuwa content, we welcome students from ALL Sri Lankan universities. Our vision is to create a unified platform where every Sri Lankan student can learn and contribute, regardless of which university they attend."
        },
        {
          question: "How do you ensure content quality?",
          answer: "We have a review process where our team checks all submissions for relevance, quality, and appropriateness. Content creators can build reputations through their profiles, and the community can provide feedback. If you spot any issues, report them to us and we'll take action quickly!"
        }
      ]
    },
    {
      title: "Vision & Future 🚀",
      icon: "🌟",
      faqs: [
        {
          question: "What's the long-term vision for Kuppi Hub?",
          answer: "Our dream is simple but powerful: create a generation of knowledgeable Sri Lankan students who help each other succeed and together face the world with confidence. We want Kuppi Hub to be the go-to platform where every Sri Lankan student finds the help they need and gives back to the community."
        },
        {
          question: "Will Kuppi Hub always be free?",
          answer: "YES! This is our commitment. Education should never be a privilege of the wealthy. Our platform will remain 100% free forever. We're funded by donations from our batch and use free/open-source technologies to keep costs minimal."
        },
        {
          question: "Are you planning to expand beyond Sri Lanka?",
          answer: "Right now, we're focused on serving Sri Lankan students perfectly. Once we've achieved that goal and built a strong foundation, we might consider helping student communities in other countries set up similar platforms. But Sri Lanka comes first! 🇱🇰"
        },
        {
          question: "How can I stay updated with new features?",
          answer: "Follow our updates through: our website announcements, our Telegram bot @KuppihubBot, our GitHub repository for technical updates, and our email newsletter (subscribe through the website). We're constantly adding new features based on student feedback!"
        }
      ]
    }
  ];

  const toggleFAQ = (categoryIndex, faqIndex) => {
    const id = `${categoryIndex}-${faqIndex}`;
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-8 md:p-12 rounded-2xl shadow-xl">
            <h1 className="text-2xl md:text-4xl font-bold mb-6">
              Frequently Asked Questions 🤔
            </h1>
            <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Got questions about Kuppi Hub? We've got answers! Everything you need to know about 
              our free, student-driven educational platform.
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-white/50">
            <div className="grid gap-4 md:grid-cols-4 text-center">
              <div className="p-4">
                <div className="text-2xl font-bold text-blue-400">100%</div>
                <div className="text-gray-600 text-sm">Completely Free</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-green-600">All Faculties</div>
                <div className="text-gray-600 text-sm">Every Subject</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-purple-600">3 Languages</div>
                <div className="text-gray-600 text-sm">Sinhala, Tamil, English</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-bold text-orange-600">Open Source</div>
                <div className="text-gray-600 text-sm">Community Driven</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/50 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  {category.title}
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {category.faqs.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(categoryIndex, faqIndex)}
                      className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center group"
                    >
                      <span className="font-medium text-gray-800 group-hover:text-blue-400 transition-colors">
                        {faq.question}
                      </span>
                      <span className={`text-blue-400 text-xl transform transition-transform duration-200 ${
                        openFAQ === `${categoryIndex}-${faqIndex}` ? 'rotate-45' : ''
                      }`}>
                        +
                      </span>
                    </button>
                    
                    <motion.div
                      initial={false}
                      animate={{
                        height: openFAQ === `${categoryIndex}-${faqIndex}` ? 'auto' : 0,
                        opacity: openFAQ === `${categoryIndex}-${faqIndex}` ? 1 : 0
                      }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Contact Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-green-500 to-blue-400 text-white p-8 rounded-xl shadow-xl text-center">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <span className="text-3xl mr-3">💬</span>
              Still Have Questions?
            </h2>
            <p className="text-green-100 mb-6 leading-relaxed">
              Can't find what you're looking for? Our team is always happy to help! 
              We're students too, so we totally get it.
            </p>
            
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="text-2xl mb-2">📧</div>
                <div className="font-medium">Email Us</div>
                <div className="text-green-100 text-sm">kuppihub@cse23.org</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="text-2xl mb-2">🤖</div>
                <div className="font-medium">Telegram Bot</div>
                <div className="text-green-100 text-sm">@KuppihubBot</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <div className="text-2xl mb-2">💻</div>
                <div className="font-medium">GitHub</div>
                <div className="text-green-100 text-sm">Open Source</div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20">
              <h3 className="font-bold mb-2">Response Time Promise 🕐</h3>
              <p className="text-green-100 text-sm">
                We usually respond within 24-48 hours. Remember, we're students too, 
                so sometimes we might be buried in our own exams! But we'll definitely get back to you.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Community Values */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-white/50">
            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
              🤝 Our Community Values
            </h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🎓</div>
                <h3 className="font-bold text-gray-800 mb-2">Student-First</h3>
                <p className="text-gray-600 text-sm">
                  Every decision we make is with students in mind. Free, accessible, and designed by students for students.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🌍</div>
                <h3 className="font-bold text-gray-800 mb-2">Unity in Diversity</h3>
                <p className="text-gray-600 text-sm">
                  All faculties, all languages, all universities. We believe in bringing Sri Lankan students together.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="font-bold text-gray-800 mb-2">Knowledge Sharing</h3>
                <p className="text-gray-600 text-sm">
                  When you teach, you learn twice. Every contribution makes our community stronger.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-8 rounded-xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Ready to Join the Kuppi Revolution? 🚀</h2>
            <p className="text-blue-100 mb-6">
              Whether you're here to learn or teach (or both!), welcome to the family!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                <span className="font-medium">🎯 Find Your Subject</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                <span className="font-medium">📚 Start Learning</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                <span className="font-medium">🤝 Help Others</span>
              </div>
            </div>
            <p className="text-blue-200 text-sm mt-6 italic">
              "Because together we learn, together we grow, together we build Sri Lanka's future!" 🇱🇰
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;