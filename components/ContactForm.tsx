"use client";

import { useState } from "react";
import { productCategories, products } from "@/lib/products";

const inputClass =
  "w-full rounded-xl border border-sand bg-warmwhite px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 transition-colors focus:border-champagne focus:outline-none focus:ring-2 focus:ring-champagne/30";
const labelClass = "mb-1.5 block text-sm font-medium text-charcoal";

const categoryOptions = [...productCategories.map((c) => c.name), "أخرى"];
const productOptions = [...products.map((p) => p.name), "أخرى"];

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
  existingRecipe: "لا",
  packagingSupport: "لا",
  quantity: "",
  targetMarket: "",
  message: "",
};

function buildWhatsAppLink(form: FormState): string {
  const lines = [
    "استفسار تصنيع بعلامة خاصة جديد — الشحيل للصناعات الغذائية",
    "",
    `الاسم الكامل: ${form.fullName || "-"}`,
    `الشركة: ${form.companyName || "-"}`,
    `الدولة: ${form.country || "-"}`,
    `البريد الإلكتروني: ${form.email || "-"}`,
    `رقم واتساب: ${form.whatsapp || "-"}`,
    `فئة المنتج: ${form.category || "-"}`,
    `المنتج المطلوب: ${form.product || "-"}`,
    `وصفة حالية: ${form.existingRecipe}`,
    `بحاجة لدعم تغليف: ${form.packagingSupport}`,
    `الكمية الشهرية المتوقعة: ${form.quantity || "-"}`,
    `السوق المستهدف: ${form.targetMarket || "-"}`,
    "",
    `ملخص المشروع: ${form.message || "-"}`,
  ];
  return `https://wa.me/971547431444?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const link = buildWhatsAppLink(form);
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
            الاسم الكامل
          </label>
          <input
            id="fullName"
            className={inputClass}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="اسمك"
            required
          />
        </div>
        <div>
          <label htmlFor="companyName" className={labelClass}>
            اسم الشركة
          </label>
          <input
            id="companyName"
            className={inputClass}
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            placeholder="الشركة"
          />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>
            الدولة
          </label>
          <input
            id="country"
            className={inputClass}
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder="الدولة"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            dir="ltr"
            required
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className={labelClass}>
            رقم واتساب
          </label>
          <input
            id="whatsapp"
            className={inputClass}
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="+971 ..."
            dir="ltr"
          />
        </div>
        <div>
          <label htmlFor="quantity" className={labelClass}>
            الكمية الشهرية المتوقعة
          </label>
          <input
            id="quantity"
            className={inputClass}
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            placeholder="مثال: كراتين / وحدات شهريًا"
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>
            فئة المنتج
          </label>
          <select
            id="category"
            className={inputClass}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">اختر فئة</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="product" className={labelClass}>
            المنتج المطلوب
          </label>
          <select
            id="product"
            className={inputClass}
            value={form.product}
            onChange={(e) => update("product", e.target.value)}
          >
            <option value="">اختر منتجًا</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="existingRecipe" className={labelClass}>
            هل لديك وصفة حالية؟
          </label>
          <select
            id="existingRecipe"
            className={inputClass}
            value={form.existingRecipe}
            onChange={(e) => update("existingRecipe", e.target.value)}
          >
            <option value="لا">لا</option>
            <option value="نعم">نعم</option>
          </select>
        </div>
        <div>
          <label htmlFor="packagingSupport" className={labelClass}>
            هل تحتاج إلى دعم في التغليف؟
          </label>
          <select
            id="packagingSupport"
            className={inputClass}
            value={form.packagingSupport}
            onChange={(e) => update("packagingSupport", e.target.value)}
          >
            <option value="لا">لا</option>
            <option value="نعم">نعم</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="targetMarket" className={labelClass}>
            السوق المستهدف
          </label>
          <input
            id="targetMarket"
            className={inputClass}
            value={form.targetMarket}
            onChange={(e) => update("targetMarket", e.target.value)}
            placeholder="مثال: تجزئة الإمارات، تصدير الخليج، قطاع المطاعم"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            رسالتك / ملخص المشروع
          </label>
          <textarea
            id="message"
            rows={5}
            className={inputClass}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="أخبرنا عن فكرة منتجك، وتموضعك، وأهدافك."
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary">
          إرسال عبر واتساب
        </button>
        <p className="text-xs text-stone">
          لا حاجة لإنشاء حساب — الإرسال يجهّز رسالة واتساب تحتوي على بياناتك
          لفريقنا.
        </p>
      </div>

      {submitted && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-champagne/50 bg-warmwhite p-5 text-sm leading-relaxed text-charcoal"
        >
          <span className="font-semibold text-ink">شكرًا لك</span> — طلب
          التصنيع جاهز للإرسال عبر واتساب. سيراجع فريقنا تفاصيل مشروعك ويعاود
          التواصل معك قريبًا.
          <span className="mt-2 block text-xs text-stone">
            إذا لم يفتح واتساب تلقائيًا،{" "}
            <a
              href={buildWhatsAppLink(form)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold underline"
            >
              اضغط هنا لفتحه
            </a>
            .
          </span>
        </div>
      )}
    </form>
  );
}
