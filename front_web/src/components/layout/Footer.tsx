import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  navigation: [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ],
  services: [
    { name: "Cladding Types", path: "/services#cladding" },
    { name: "Material Database", path: "/services#materials" },
    { name: "Pricing Engine", path: "/services#pricing" },
    { name: "3D Rendering", path: "/services#rendering" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-petroleum text-cream">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center">
                <span className="text-petroleum font-display font-bold text-xl">B</span>
              </div>
              <span className="font-display font-semibold text-xl text-cream">
                Buildex4Syria
              </span>
            </Link>
            <p className="font-body text-cream/80 text-sm leading-relaxed">
              Intelligent cladding and construction cost platform for Syrian homeowners and contractors.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center transition-all duration-200 hover:bg-cream/20 hover:scale-110"
                >
                  <social.icon size={18} className="text-cream" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-body text-cream/80 hover:text-cream transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-body text-cream/80 hover:text-cream transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-cream/60 mt-1 flex-shrink-0" />
                <span className="font-body text-cream/80 text-sm">
                  Damascus, Syria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-cream/60 flex-shrink-0" />
                <span className="font-body text-cream/80 text-sm">
                  +963 11 XXX XXXX
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-cream/60 flex-shrink-0" />
                <span className="font-body text-cream/80 text-sm">
                  info@buildex4syria.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-cream/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-cream/60 text-sm">
              © {new Date().getFullYear()} Buildex4Syria. All rights reserved.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="font-body text-cream/60 text-sm hover:text-cream transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
