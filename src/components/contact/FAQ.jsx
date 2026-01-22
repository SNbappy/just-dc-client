import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: 'How can I join JUST Debate Club?',
            answer: 'You can join by attending our orientation sessions at the beginning of each semester or by contacting us directly through this contact form. We welcome students from all departments and batches.',
        },
        {
            question: 'Do I need prior debate experience to join?',
            answer: 'Not at all! We welcome beginners and provide comprehensive training programs. Our experienced members will mentor you and help you develop your debate skills from scratch.',
        },
        {
            question: 'What activities does the club organize?',
            answer: 'We organize weekly practice sessions, workshops, inter-university tournaments, public speaking events, and social gatherings. We also participate in national and international debate competitions.',
        },
        {
            question: 'Is there any membership fee?',
            answer: 'We have a minimal annual membership fee that covers club activities, materials, and event participation. The exact amount is announced at the beginning of each academic year.',
        },
        {
            question: 'When do practice sessions take place?',
            answer: 'Regular practice sessions are held every week, typically on weekends. The exact schedule is shared with members at the start of each semester and may vary based on academic calendars.',
        },
        {
            question: 'Can I participate in tournaments as a beginner?',
            answer: 'Yes! We have different levels of tournaments. Beginners can start with internal competitions and gradually progress to inter-university events as they gain experience and confidence.',
        },
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="font-heading font-bold text-4xl text-dark mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray text-lg">
                        Find answers to common questions about JUST Debate Club
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                            {/* Question */}
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <h3 className="font-heading font-bold text-lg text-dark pr-4">
                                    {faq.question}
                                </h3>
                                <div className={`flex-shrink-0 w-8 h-8 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                    }`}>
                                    {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                </div>
                            </button>

                            {/* Answer */}
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}>
                                <div className="px-6 pb-6">
                                    <p className="text-gray leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions */}
                <div className="text-center mt-12 p-8 bg-gradient-to-br from-primary to-primary-dark rounded-2xl">
                    <h3 className="font-heading font-bold text-2xl text-white mb-3">
                        Still Have Questions?
                    </h3>
                    <p className="text-white text-opacity-90 mb-6">
                        Don't hesitate to reach out. We're here to help!
                    </p>
                    <a
                        href="mailto:info@justdebateclub.org"
                        className="inline-block px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-opacity-90 transition-all"
                    >
                        Email Us Directly
                    </a>
                </div>

            </div>
        </section>
    );
};

export default FAQ;
