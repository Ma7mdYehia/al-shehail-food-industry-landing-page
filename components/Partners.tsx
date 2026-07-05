import Link from "next/link";
import PartnerProjectGrid from "./partners/PartnerProjectGrid";

export default function Partners() {
  return (
    <section className="border-y border-sand/60 bg-warmwhite py-14 sm:py-16">
      <div className="container-x">
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">
            <span className="h-px w-6 bg-champagne" />
            شركاء وثقوا في تصنيع منتجاتهم
          </span>
          <p className="mt-3 max-w-xl text-sm text-stone">
            الشحيل تطوّر وتصنّع تشكيلات مخبوزات بعلامة خاصة لعلامات غذائية
            راسخة في الإمارات.
          </p>
        </div>

        {/* Clickable partner cards — clean logo + name, open the project modal */}
        <PartnerProjectGrid className="mt-10" variant="compact" />

        <div className="mt-10 text-center">
          <Link
            href="/partners"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold"
          >
            استعرض الشركاء
            <svg
              className="rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
