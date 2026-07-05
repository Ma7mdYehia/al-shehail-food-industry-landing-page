import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import { DevelopIcon, ProductionIcon, PackagingIcon, RetailIcon } from "../Icons";

const cards = [
  {
    title: "تطوير المنتجات",
    text: "من الطلب الأولي إلى منتج نهائي جاهز للرف.",
    Icon: DevelopIcon,
  },
  {
    title: "تخصيص الوصفات",
    text: "تركيبات مصمَّمة خصيصًا لسوقك المستهدف.",
    Icon: ProductionIcon,
  },
  {
    title: "تصنيع العلامة الخاصة",
    text: "إنتاج يتماشى مع علامتك وفئتك.",
    Icon: PackagingIcon,
  },
  {
    title: "توريد جاهز للرف",
    text: "توريد ثابت وقابل للتوسّع لشبكتك.",
    Icon: RetailIcon,
  },
];

export default function CapabilitiesTeaser() {
  return (
    <section className="section bg-warmwhite">
      <div className="container-x">
        <SectionHeading
          eyebrow="القدرات"
          title="ما نقدّمه لعلامتك"
          description="شريك تصنيع متكامل الخدمات، مجهّز للتطوير والإنتاج والتوريد بمعايير التجزئة."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-sand bg-cream p-6 shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-beige text-gold">
                <card.Icon width={22} height={22} />
              </span>
              <h3 className="mt-5 font-serif text-base font-semibold text-ink">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <TeaserLink href="/private-label/#capabilities" label="استعرض القدرات" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
