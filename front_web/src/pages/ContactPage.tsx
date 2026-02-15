import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Damascus, Syria", "Al-Mazzeh District"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+963 11 XXX XXXX", "Sun - Thu: 9AM - 6PM"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@buildex4syria.com", "support@buildex4syria.com"],
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setIsSubmitted(false);
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23022d37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-mono text-sm text-petroleum-accent bg-petroleum-accent/10 px-4 py-2 rounded-full mb-6">
              Get in Touch
            </span>
            <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-petroleum mb-6 leading-tight">
              Let's Build{" "}
              <span className="font-semibold">Something Together</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-petroleum/70 leading-relaxed">
              Have questions about our platform? Want to discuss a project? 
              We'd love to hear from you. Reach out and our team will respond promptly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-cream">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-sm">
                <h2 className="font-display font-semibold text-2xl text-petroleum mb-6">
                  Send Us a Message
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-petroleum mb-2">
                      Message Sent!
                    </h3>
                    <p className="font-body text-petroleum/70">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-body font-medium text-petroleum">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Ahmad Al-Hassan"
                          className={cn(
                            "h-12 bg-cream/50 border-petroleum/20 focus:border-petroleum-accent focus:ring-petroleum-accent/20 font-body",
                            errors.name && "border-red-500 focus:border-red-500"
                          )}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm font-body">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-body font-medium text-petroleum">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ahmad@example.com"
                          className={cn(
                            "h-12 bg-cream/50 border-petroleum/20 focus:border-petroleum-accent focus:ring-petroleum-accent/20 font-body",
                            errors.email && "border-red-500 focus:border-red-500"
                          )}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm font-body">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-body font-medium text-petroleum">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+963 XX XXX XXXX"
                          className="h-12 bg-cream/50 border-petroleum/20 focus:border-petroleum-accent focus:ring-petroleum-accent/20 font-body"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="font-body font-medium text-petroleum">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Project Inquiry"
                          className="h-12 bg-cream/50 border-petroleum/20 focus:border-petroleum-accent focus:ring-petroleum-accent/20 font-body"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-body font-medium text-petroleum">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project or question..."
                        rows={6}
                        className={cn(
                          "bg-cream/50 border-petroleum/20 focus:border-petroleum-accent focus:ring-petroleum-accent/20 font-body resize-none",
                          errors.message && "border-red-500 focus:border-red-500"
                        )}
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm font-body">{errors.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto bg-petroleum-accent hover:bg-petroleum text-cream font-body font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(2,45,55,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Send Message
                          <Send className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="lg:col-span-5 space-y-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="font-display font-semibold text-2xl text-petroleum mb-6">
                  Contact Information
                </h2>
                <p className="font-body text-petroleum/70 leading-relaxed">
                  Our team is available Sunday through Thursday, 9AM to 6PM Syria time. 
                  We typically respond to all inquiries within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm"
                  >
                    <div className="w-12 h-12 bg-petroleum-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-petroleum-accent" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-petroleum mb-1">
                        {item.title}
                      </h3>
                      {item.details.map((detail) => (
                        <p key={detail} className="font-body text-petroleum/70">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="relative h-64 bg-petroleum/5 rounded-xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-petroleum/20 mx-auto mb-2" />
                    <p className="font-body text-petroleum/40">Map View</p>
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=60"
                  alt="Damascus Map"
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-mono text-sm text-petroleum-accent bg-petroleum-accent/10 px-4 py-2 rounded-full mb-6">
              FAQ
            </span>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-petroleum">
              Frequently Asked{" "}
              <span className="font-semibold">Questions</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "How accurate are the cost estimates?",
                answer: "Our pricing engine maintains 98% accuracy by continuously updating market prices and factoring in regional variations. We partner with local suppliers to ensure real-time pricing data.",
              },
              {
                question: "Can I use Buildex4Syria for commercial projects?",
                answer: "Absolutely! Our platform is designed for both residential and commercial projects. We offer enterprise plans with additional features for contractors and construction companies.",
              },
              {
                question: "How do I get started?",
                answer: "Simply create a free account, input your room dimensions, and start exploring our material database. Our intuitive interface guides you through each step of the planning process.",
              },
              {
                question: "Is my project data secure?",
                answer: "Yes, we take data security seriously. All project data is encrypted and stored securely. We never share your information with third parties without your explicit consent.",
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                className="bg-cream rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="font-display font-semibold text-lg text-petroleum mb-2">
                  {faq.question}
                </h3>
                <p className="font-body text-petroleum/70">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
