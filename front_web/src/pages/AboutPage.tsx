import { motion } from "framer-motion";
import { Target, Users, Award, Heart } from "lucide-react";
import Layout from "@/components/layout/Layout";

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "Every calculation and visualization is crafted with meticulous attention to detail.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Built by Syrians, for Syrians. We understand the unique needs of our market.",
  },
  {
    icon: Award,
    title: "Quality",
    description: "We partner with the finest material suppliers to ensure premium options.",
  },
  {
    icon: Heart,
    title: "Trust",
    description: "Transparent pricing and honest recommendations guide every interaction.",
  },
];

const team = [
  {
    name: "Ahmad Al-Hassan",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Layla Mahmoud",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Omar Khalil",
    role: "Lead Engineer",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
];

export default function AboutPage() {
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
              Our Story
            </span>
            <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-petroleum mb-6 leading-tight">
              Building the Future of{" "}
              <span className="font-semibold">Syrian Construction</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-petroleum/70 leading-relaxed">
              Buildex4Syria was born from a simple observation: Syrian homeowners and contractors 
              deserve modern tools to plan and visualize their construction projects with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Column Story Section */}
      <section className="py-16 lg:py-24 bg-cream">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display font-light text-3xl sm:text-4xl text-petroleum">
                A Platform Built with{" "}
                <span className="font-semibold">Purpose</span>
              </h2>
              <div className="space-y-4 font-body text-petroleum/70 leading-relaxed">
                <p>
                  In 2020, our founding team recognized a critical gap in the Syrian construction 
                  market. Homeowners struggled to visualize their renovation projects, contractors 
                  lacked reliable pricing data, and everyone faced uncertainty about material costs.
                </p>
                <p>
                  We set out to create a comprehensive platform that would democratize access to 
                  professional construction planning tools. By combining an extensive material 
                  database with intelligent cost calculation and stunning 3D visualization, we've 
                  empowered thousands of Syrians to build with confidence.
                </p>
                <p>
                  Today, Buildex4Syria serves as the trusted partner for homeowners planning 
                  renovations, contractors bidding on projects, and architects designing spaces 
                  that honor Syria's rich architectural heritage while embracing modern innovation.
                </p>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute -inset-4 bg-petroleum-accent/10 rounded-3xl transform -rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80"
                alt="Syrian Architecture"
                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
              />
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6">
                <p className="font-mono text-3xl font-bold text-petroleum-accent">Since 2020</p>
                <p className="font-body text-sm text-petroleum/60">Serving Syrian builders</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-mono text-sm text-petroleum-accent bg-petroleum-accent/10 px-4 py-2 rounded-full mb-6">
              Our Values
            </span>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-petroleum">
              What Drives Us{" "}
              <span className="font-semibold">Forward</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-petroleum-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-petroleum-accent" />
                </div>
                <h3 className="font-display font-semibold text-xl text-petroleum mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-petroleum/70">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24 bg-cream">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-mono text-sm text-petroleum-accent bg-petroleum-accent/10 px-4 py-2 rounded-full mb-6">
              Our Team
            </span>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-petroleum">
              Meet the People Behind{" "}
              <span className="font-semibold">Buildex4Syria</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petroleum/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-display font-semibold text-xl text-petroleum">
                  {member.name}
                </h3>
                <p className="font-body text-petroleum/60">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 lg:py-24 bg-petroleum">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <blockquote className="font-display font-light text-2xl sm:text-3xl lg:text-4xl text-cream leading-relaxed">
              "Our mission is to empower every Syrian to build their dream space with 
              confidence, clarity, and precision — honoring our architectural heritage 
              while embracing the future."
            </blockquote>
            <div className="mt-8">
              <p className="font-body font-semibold text-cream">Ahmad Al-Hassan</p>
              <p className="font-body text-cream/60">Founder & CEO</p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
