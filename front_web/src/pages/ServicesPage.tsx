import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Database, Calculator, Box, ChevronDown, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const services = [
  {
    id: "cladding",
    icon: Layers,
    title: "Cladding Types",
    shortDescription: "Comprehensive selection of interior and exterior cladding solutions.",
    fullDescription: `Our platform offers an extensive range of cladding options tailored to Syrian architecture and climate conditions. From traditional stone facades that echo Damascus's historic beauty to modern composite panels for contemporary designs, we provide detailed specifications for every material.`,
    features: [
      "Natural stone cladding (limestone, marble, granite)",
      "Ceramic and porcelain tile systems",
      "Wood and composite panels",
      "Metal cladding solutions",
      "Insulated facade systems",
      "Traditional Syrian architectural elements",
    ],
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
  },
  {
    id: "materials",
    icon: Database,
    title: "Material Database",
    shortDescription: "500+ materials with detailed specifications and regional availability.",
    fullDescription: `Access our comprehensive database of construction materials sourced from trusted Syrian and international suppliers. Each material entry includes detailed technical specifications, installation requirements, maintenance guidelines, and real-time availability information.`,
    features: [
      "Detailed technical specifications",
      "High-resolution material samples",
      "Supplier contact information",
      "Regional availability tracking",
      "Quality certifications",
      "Installation guidelines",
    ],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    id: "pricing",
    icon: Calculator,
    title: "Pricing Engine",
    shortDescription: "Accurate cost estimates with real-time market pricing.",
    fullDescription: `Our intelligent pricing engine provides accurate cost estimates by analyzing current market prices, labor costs, and regional factors. Get detailed breakdowns that help you budget effectively and compare options to find the best value for your project.`,
    features: [
      "Real-time market price updates",
      "Labor cost calculations",
      "Regional pricing adjustments",
      "Material quantity optimization",
      "Budget comparison tools",
      "Export detailed quotes",
    ],
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
  },
  {
    id: "rendering",
    icon: Box,
    title: "3D Rendering",
    shortDescription: "Photorealistic visualizations of your finished space.",
    fullDescription: `See your project come to life before construction begins. Our 3D rendering engine creates photorealistic visualizations that help you make confident design decisions. Experiment with different materials, colors, and layouts in real-time.`,
    features: [
      "Photorealistic room previews",
      "Real-time material swapping",
      "Multiple lighting scenarios",
      "360° virtual tours",
      "Before/after comparisons",
      "Shareable presentation exports",
    ],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
];

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>("cladding");

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
              Our Services
            </span>
            <h1 className="font-display font-light text-4xl sm:text-5xl lg:text-6xl text-petroleum mb-6 leading-tight">
              Comprehensive Tools for{" "}
              <span className="font-semibold">Every Project</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-petroleum/70 leading-relaxed">
              From material selection to final visualization, our platform provides everything 
              you need to plan, cost, and visualize your construction project with confidence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Accordion Section */}
      <section className="py-16 lg:py-24 bg-cream">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-4">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={service.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                  className="w-full p-6 lg:p-8 flex items-center gap-6 text-left hover:bg-petroleum/[0.02] transition-colors"
                >
                  <div className="w-14 h-14 bg-petroleum-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-7 h-7 text-petroleum-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-xl lg:text-2xl text-petroleum mb-1">
                      {service.title}
                    </h3>
                    <p className="font-body text-petroleum/60 truncate">
                      {service.shortDescription}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-6 h-6 text-petroleum/40 transition-transform duration-300 flex-shrink-0",
                      expandedService === service.id && "rotate-180"
                    )}
                  />
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {expandedService === service.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 lg:px-8 pb-8">
                        <div className="grid lg:grid-cols-2 gap-8 pt-4 border-t border-petroleum/10">
                          {/* Content */}
                          <div className="space-y-6">
                            <p className="font-body text-petroleum/70 leading-relaxed">
                              {service.fullDescription}
                            </p>
                            <div>
                              <h4 className="font-display font-semibold text-lg text-petroleum mb-4">
                                Key Features
                              </h4>
                              <ul className="space-y-3">
                                {service.features.map((feature) => (
                                  <li key={feature} className="flex items-start gap-3">
                                    <div className="w-5 h-5 bg-petroleum-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <Check className="w-3 h-3 text-petroleum-accent" />
                                    </div>
                                    <span className="font-body text-petroleum/70">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Image */}
                          <div className="relative">
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-64 lg:h-full object-cover rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              How It Works
            </span>
            <h2 className="font-display font-light text-3xl sm:text-4xl text-petroleum">
              Simple Steps to{" "}
              <span className="font-semibold">Your Dream Space</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Input Dimensions", description: "Enter your room measurements and specifications" },
              { step: "02", title: "Select Materials", description: "Browse and choose from our extensive catalog" },
              { step: "03", title: "Get Pricing", description: "Receive instant, accurate cost breakdowns" },
              { step: "04", title: "Visualize", description: "See your finished space in stunning 3D" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="relative mb-6">
                  <span className="font-mono text-6xl font-bold text-petroleum/5">
                    {item.step}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-petroleum-accent rounded-full flex items-center justify-center">
                      <span className="font-mono text-lg font-bold text-cream">{item.step}</span>
                    </div>
                  </div>
                </div>
                <h3 className="font-display font-semibold text-lg text-petroleum mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-petroleum/60 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-petroleum">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-light text-3xl sm:text-4xl text-cream mb-6">
              Ready to Start{" "}
              <span className="font-semibold">Planning?</span>
            </h2>
            <p className="font-body text-lg text-cream/70 mb-8">
              Create your free account and begin exploring our comprehensive suite of 
              construction planning tools today.
            </p>
            <button className="bg-cream text-petroleum hover:bg-cream/90 font-body font-semibold px-8 py-4 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(255,237,216,0.3)]">
              Get Started Free
            </button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
