"use client";

import { useState } from "react";
import { productCategories, products } from "@/lib/products";

const inputClass =
  "w-full rounded-xl border border-sand bg-warmwhite px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 transition-colors focus:border-champagne focus:outline-none focus:ring-2 focus:ring-champagne/30";
const labelClass = "mb-1.5 block text-sm font-medium text-charcoal";

const categoryOptions = [...productCategories.map((c) => c.name), "Other"];
const productOptions = [...products.map((p) => p.name), "Other"];

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

function buildWhatsAppLink(form: FormState): string {
  const lines = [
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
            Full Name
          </label>
          <input
            id="fullName"
            className={inputClass}
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label htmlFor="companyName" className={labelClass}>
            Company Name
          </label>
          <input
            id="companyName"
            className={inputClass}
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            placeholder="Company"
          />
        </div>
        <div>
          <label htmlFor="country" className={labelClass}>
            Country
          </label>
          <input
            id="country"
            className={inputClass}
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            placeholder="Country"
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className={labelClass}>
            WhatsApp Number
          </label>
          <input
            id="whatsapp"
            className={inputClass}
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="+971 ..."
          />
        </div>
        <div>
          <label htmlFor="quantity" className={labelClass}>
            Expected Monthly Quantity
          </label>
          <input
            id="quantity"
            className={inputClass}
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            placeholder="e.g. cartons / units per month"
          />
        </div>
        <div>
          <label htmlFor="category" className={labelClass}>
            Product Category
          </label>
          <select
            id="category"
            className={inputClass}
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="product" className={labelClass}>
            Product of Interest
          </label>
          <select
            id="product"
            className={inputClass}
            value={form.product}
            onChange={(e) => update("product", e.target.value)}
          >
            <option value="">Select a product</option>
            {productOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="existingRecipe" className={labelClass}>
            Do you have an existing recipe?
          </label>
          <select
            id="existingRecipe"
            className={inputClass}
            value={form.existingRecipe}
            onChange={(e) => update("existingRecipe", e.target.value)}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div>
          <label htmlFor="packagingSupport" className={labelClass}>
            Do you need packaging support?
          </label>
          <select
            id="packagingSupport"
            className={inputClass}
            value={form.packagingSupport}
            onChange={(e) => update("packagingSupport", e.target.value)}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="targetMarket" className={labelClass}>
            Target Market
          </label>
          <input
            id="targetMarket"
            className={inputClass}
            value={form.targetMarket}
            onChange={(e) => update("targetMarket", e.target.value)}
            placeholder="e.g. UAE retail, GCC export, foodservice"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            Message / Project Brief
          </label>
          <textarea
            id="message"
            rows={5}
            className={inputClass}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell us about your product idea, positioning, and goals."
          />
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary">
          Send via WhatsApp
        </button>
        <p className="text-xs text-stone">
          No account needed — submitting prepares a WhatsApp message with your
          details for our team.
        </p>
      </div>

      {submitted && (
        <div
          role="status"
          className="mt-6 rounded-2xl border border-champagne/50 bg-warmwhite p-5 text-sm leading-relaxed text-charcoal"
        >
          <span className="font-semibold text-ink">Thank you</span> — your
          manufacturing request is ready to send on WhatsApp. Our team will
          review your project details and get back to you shortly.
          <span className="mt-2 block text-xs text-stone">
            If WhatsApp didn’t open automatically,{" "}
            <a
              href={buildWhatsAppLink(form)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold underline"
            >
              tap here to open it
            </a>
            .
          </span>
        </div>
      )}
    </form>
  );
}
