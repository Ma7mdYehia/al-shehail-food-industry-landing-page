import SectionHeading from "../SectionHeading";
import TeaserLink from "../TeaserLink";
import ProcessJourney from "../ProcessJourney";
import FlowBackdrop from "../decor/FlowBackdrop";

export default function PrivateLabelTeaser() {
  return (
    <section className="section relative overflow-hidden">
      {/* Subtle premium 3D-style abstract flow pattern behind the journey */}
      <FlowBackdrop />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="حلول العلامة الخاصة"
          title="من الفكرة إلى الرف، خطوة بخطوة"
          description="خط تصنيع متكامل — تطوير المنتج، والوصفة، والعينات، ودراسة التكلفة، والتغليف، والإنتاج، ومراقبة الجودة، والتوريد الجاهز للرف."
        />

        <ProcessJourney />

        <div className="mt-12 text-center">
          <TeaserLink href="/private-label" label="استعرض العلامة الخاصة" variant="secondary" />
        </div>
      </div>
    </section>
  );
}
