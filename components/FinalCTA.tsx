import Link from "next/link";
import { whatsappLink } from "@/lib/content";
import { WhatsAppIcon } from "./Icons";

export default function FinalCTA() {
  return (
    <section id="contact" className="section">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-champagne/40 bg-gradient-to-br from-warmwhite via-cream to-beige px-6 py-16 text-center shadow-soft sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <span className="eyebrow">
              <span className="h-px w-6 bg-champagne" />
              From Idea to Shelf
            </span>
            <h2 className="heading-serif mt-5 text-3xl sm:text-4xl lg:text-[2.75rem]">
              Ready to Build a Bakery Product Under Your Brand?
            </h2>
            <p className="mt-5 text-base leading-relaxed text-stone sm:text-lg">
              Share your product idea, target market, and expected volume — our
              team will help you explore the right private label manufacturing
              solution.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary">
                Request Consultation
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <WhatsAppIcon width={16} height={16} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
