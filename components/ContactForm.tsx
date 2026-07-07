"use client";

import { useState } from "react";
import { productCategories, products } from "@/lib/products";
import type { Locale } from "@/lib/i18n";

const inputClass =
  "w-full rounded-xl border border-sand bg-warmwhite px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 transition-colors focus:border-champagne focus:outline-none focus:ring-2 focus:ring-champagne/30";
const labelClass = "mb-1.5 block text-sm font-medium text-charcoal";

// Component chrome strings per locale.
const L = {
  en: {
    fullName: "Full Name",
    yourName: "Your name",
    company: "Company Name",
    companyPh: "Company",
    country: "Country",
    countryPh: "Country",
    email: "Email",
    emailPh: "you@company.com",
    whatsapp: "WhatsApp Number",
    whatsappPh: "+971 ...",
    quantity: "Expected Monthly Quantity",
    quantityPh: "e.g. cartons / units per month",
    category: "Product Category",
    selectCategory: "Select a category",
    product: "Product of Interest",
    selectProduct: "Select a product",
    other: "Other",
    existingRecipe: "Do you have an existing recipe?",
    packagingSupport: "Do you need packaging support?",
    no: "No",
    yes: "Yes",
    targetMarket: "Target Market",
    targetMarketPh: "e.g. UAE retail, GCC export, foodservice",
    message: "Message / Project Brief",
    messagePh: "Tell us about your product idea, positioning, and goals.",
    send: "Send via WhatsApp",
    helper:
      "No account needed — submitting prepares a WhatsApp message with your details for our team.",
    thankYou: "Thank you",
    successBody:
      "— your manufacturing request is ready to send on WhatsApp. Our team will review your project details and get back to you shortly.",
    ifNotOpen: "If WhatsApp didn’t open automatically,",
    tapHere: "tap here to open it",
  },
  ar: {
    fullName: "الاسم الكامل",
    yourName: "اسمك",
    company: "اسم الشركة",
    companyPh: "الشركة",
    country: "الدولة",
    countryPh: "الدولة",
    email: "البريد الإلكتروني",
    emailPh: "you@company.com",
    whatsapp: "رقم واتساب",
    whatsappPh: "+971 ...",
    quantity: "الكمية الشهرية المتوقعة",
    quantityPh: "مثال: كراتين / وحدات شهريًا",
    category: "فئة المنتج",
    selectCategory: "اختر فئة",
    product: "المنتج محل الاهتمام",
    selectProduct: "اختر منتجًا",
    other: "أخرى",
    existingRecipe: "هل لديك وصفة حالية؟",
    packagingSupport: "هل تحتاج إلى دعم في التغليف؟",
    no: "لا",
    yes: "نعم",
    targetMarket: "السوق المستهدف",
    targetMarketPh: "مثال: تجزئة الإمارات، تصدير الخليج، خدمات الطعام",
    message: "الرسالة / موجز المشروع",
    messagePh: "أخبرنا عن فكرة منتجك وتموضعه وأهدافك.",
    send: "أرسل عبر واتساب",
    helper: "لا حاجة لحساب — الإرسال يجهّز رسالة واتساب بتفاصيلك لفريقنا.",
    thankYou: "شكرًا لك",
    successBody:
      "— طلب التصنيع الخاص بك جاهز للإرسال عبر واتساب. سيراجع فريقنا تفاصيل مشروعك ويعاود التواصل معك قريبًا.",
    ifNotOpen: "إذا لم يفتح واتساب تلقائيًا،",
    tapHere: "اضغط هنا لفتحه",
  },
} as const;

type FormState = {
  fullName: string;
  companyName: string;
  country: string;
  email: string;
  whatsapp: string;
  category: string;
  product: string;
  existingRecipe: string;
  packagingSupport: string;
  quantity: string;
  targetMarket: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  companyName: "",
  country: "",
  email: "",
  whatsapp: "",
  category: "",
  product: "",
  existingRecipe: "No",
  packagingSupport: "No",
  quantity: "",
  targetMarket: "",
  message: "",
};

function buildWhatsAppLink(form: FormState, locale: Locale): string {
  const lines =
    locale === "ar"
      ? [
          "استفسار تصنيع بعلامة خاصة جديد — الشحيل للصناعات الغذائية",
          "",
          `الاسم الكامل: ${form.fullName || "-"}`,
          `الشركة: ${form.companyName || "-"}`,
          `الدولة: ${form.country || "-"}`,
          `البريد الإلكتروني: ${form.email || "-"}`,
          `واتساب: ${form.whatsapp || "-"}`,
          `فئة المنتج: ${form.category || "-"}`,
          `المنتج محل الاهتمام: ${form.product || "-"}`,
          `وصفة حالية: ${form.existingRecipe}`,
          `دعم التغليف مطلوب: ${form.packagingSupport}`,
          `الكمية الشهرية المتوقعة: ${form.quantity || "-"}`,
          `السوق المستهدف: ${form.targetMarket || "-"}`,
          "",
          `موجز المشروع: ${form.message || "-"}`,
        ]
      : [
          "New private label manufacturing enquiry — Al Shehail Food Industries",
          "",
          `Full Name: ${form.fullName || "-"}`,
          `Company: ${form.companyName || "-"}`,
          `Country: ${form.country || "-"}`,
          `Email: ${form.email || "-"}`,
          `WhatsApp: ${form.whatsapp || "-"}`,
          `Product Category: ${form.category || "-"}`,
          `Product of Interest: ${form.product || "-"}`,
          `Existing recipe: ${form.existingRecipe}`,
          `Packaging support needed: ${form.packagingSupport}`,
          `Expected monthly quantity: ${form.quantity || "-"}`,
          `Target market: ${form.targetMarket || "-"}`,
          "",
          `Project brief: ${form.message || "-"}`,
        ];
  return `https://wa.me/971547431444?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function ContactForm({ locale }: { locale: Locale }) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const t = L[locale];

  const categoryOptions = [
    ...productCategories.map((c) => c.name[locale]),
    t.other,
  ];
  const productOptions = [...products.map((p) => p.name[locale]), t.other];

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const link = buildWhatsAppLink(form, locale);
    window.open(link, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-sand bg-cream p-6 shadow-card sm:p-8 lg:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            {t.fullName}
          </label>
          <input
            id="fullName"
            className={inputClass}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder={t.yourName}
            required
          />
        </div>
        <div>
          <label htmlFor="companyName" className={labelClass}>
            {t.company}
          </label>
          <input
            id="companyName"
            className={inputClass}
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            placeholder={t.companyPh}
          />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>
            {t.country}
          </label>
          <input
            id="country"
            className={inputClass}
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder={t.countryPh}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            {t.email}
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder={t.emailPh}
            required
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className={labelClass}>
            {t.whatsapp}
          </label>
          <input
            id="whatsapp"
            className={inputClass}
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder={t.whatsappPh}
          />
        </div>
        <div>
          <label htmlFor="quantity" className={labelClass}>
            {t.quantity}
          </label>
          <input
            id="quantity"
            className={inputClass}
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            placeholder={t.quantityPh}
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>
            {t.category}
          </label>
          <select
            id="category"
            className={inputClass}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">{t.selectCategory}</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="product" className={labelClass}>
            {t.product}
          </label>
          <select
            id="product"
            className={inputClass}
            value={form.product}
            onChange={(e) => update("product", e.target.value)}
          >
            <option value="">{t.selectProduct}</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="existingRecipe" className={labelClass}>
            {t.existingRecipe}
          </label>
          <select
            id="existingRecipe"
            className={inputClass}
            value={form.existingRecipe}
            onChange={(e) => update("existingRecipe", e.target.value)}
          >
            <option value="No">{t.no}</option>
            <option value="Yes">{t.yes}</option>
          </select>
        </div>
        <div>
          <label htmlFor="packagingSupport" className={labelClass}>
            {t.packagingSupport}
          </label>
          <select
            id="packagingSupport"
            className={inputClass}
            value={form.packagingSupport}
            onChange={(e) => update("packagingSupport", e.target.value)}
          >
            <option value="No">{t.no}</option>
            <option value="Yes">{t.yes}</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="targetMarket" className={labelClass}>
            {t.targetMarket}
          </label>
          <input
            id="targetMarket"
            className={inputClass}
            value={form.targetMarket}
            onChange={(e) => update("targetMarket", e.target.value)}
            placeholder={t.targetMarketPh}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            {t.message}
          </label>
          <textarea
            id="message"
            rows={5}
            className={inputClass}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder={t.messagePh}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary">
          {t.send}
        </button>
        <p className="text-xs text-stone">{t.helper}</p>
      </div>

      {submitted && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-champagne/50 bg-warmwhite p-5 text-sm leading-relaxed text-charcoal"
        >
          <span className="font-semibold text-ink">{t.thankYou}</span>{" "}
          {t.successBody}
          <span className="mt-2 block text-xs text-stone">
            {t.ifNotOpen}{" "}
            <a
              href={buildWhatsAppLink(form, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold underline"
            >
              {t.tapHere}
            </a>
            .
          </span>
        </div>
      )}
    </form>
  );
}
