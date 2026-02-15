import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layers, Calculator, Box, ArrowRight, ChevronDown } from "lucide-react";
import Layout from "@/components/layout/Layout";

const features = [
  {
    icon: Layers,
    title: "Material Selection",
    description:
      "Browse our extensive database of premium cladding materials including natural stone, ceramic tiles, wood panels, and modern composites.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    icon: Calculator,
    title: "Cost Calculation",
    description:
      "Get instant, accurate cost estimates for your entire project. Our pricing engine factors in materials, labor, and regional pricing.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80",
  },
  {
    icon: Box,
    title: "3D Visualization",
    description:
      "See your finished space before construction begins. Our 3D rendering engine brings your vision to life with photorealistic previews.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 ">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
            alt="Modern Syrian Architecture"
            className="w-full h-full object-cover rounded-b-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/80 to-cream/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(255,237,216,0.3)_100%)]" />
        </div>

        {/* Hero Content */}
        <div className="mx-auto px-6 lg:px-8 relative z-10 pt-24 backdrop-blur-md bg-transparent w-full">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block font-mono text-sm bg-petroleum-accent/10 px-4 py-2 rounded-full mb-4 text-white">
                Intelligent Construction Planning for Syria
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display font-light text-4xl sm:text-5xl lg:text-6xl xl:text-7xl  leading-tight text-white"
            >
              Build Your Vision,{" "}
              <span className="font-semibold">Calculate Your Cost</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="font-body text-white text-lg sm:text-xl text-petroleum/70 max-w-2xl mx-auto leading-relaxed"
            >
              The complete platform for Syrian homeowners and contractors to visualize, 
              cost, and plan interior and exterior cladding projects with precision.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-petroleum-accent hover:bg-petroleum text-cream font-body font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(2,45,55,0.15)] group"
              >
                Start Planning
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link to="/services">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-petroleum text-petroleum hover:bg-petroleum hover:text-cream hover:scale-[1.03] duration-300 font-body font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200"
                >
                  Explore Services
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 pt-8 border-t border-petroleum/10 justify-center"
            >
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-petroleum-accent">500+</p>
                <p className="font-body text-sm text-petroleum/60">Materials Available</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-petroleum-accent">98%</p>
                <p className="font-body text-sm text-petroleum/60">Cost Accuracy</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-3xl font-bold text-petroleum-accent">2,000+</p>
                <p className="font-body text-sm text-petroleum/60">Projects Planned</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center gap-2 text-petroleum/50"
          >
            <span className="font-body text-sm">Scroll to explore</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-cream relative">
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23022d37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-mono text-sm text-petroleum-accent bg-petroleum-accent/10 px-4 py-2 rounded-full mb-6">
              Core Capabilities
            </span>
            <h2 className="font-display font-light text-3xl sm:text-4xl lg:text-5xl text-petroleum mb-6">
              Everything You Need to{" "}
              <span className="font-semibold">Plan Your Project</span>
            </h2>
            <p className="font-body text-lg text-petroleum/70">
              From material selection to final cost estimation, our platform provides 
              comprehensive tools for every stage of your construction planning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-petroleum/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-cream rounded-xl flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-petroleum-accent" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  <h3 className="font-display font-semibold text-xl text-petroleum mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-body text-petroleum/70 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 mt-4 font-body font-semibold text-petroleum-accent hover:text-petroleum transition-colors group/link"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-petroleum relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-petroleum-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cream/5 rounded-full blur-2xl" />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display font-light text-3xl sm:text-4xl lg:text-5xl text-cream mb-6">
              Ready to Start Your{" "}
              <span className="font-semibold">Construction Journey?</span>
            </h2>
            <p className="font-body text-lg text-cream/70 mb-10 max-w-2xl mx-auto">
              Join thousands of Syrian homeowners and contractors who trust Buildex4Syria 
              for their construction planning needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-cream text-petroleum hover:bg-cream/90 font-body font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(255,237,216,0.3)] group"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-cream hover:text-petroleum hover:bg-petroleum hover:border-petroleum font-body font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(255,255,255,0.3)] group"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
