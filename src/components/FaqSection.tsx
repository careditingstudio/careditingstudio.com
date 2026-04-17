import Link from "next/link";
import { display } from "@/app/fonts";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How much does your photo editing service cost?",
    answer:
      "Our pricing starts from $0.20 per image and varies based on complexity, including background removal, masking, retouching, and compositing. We also provide custom quotes for bulk orders.",
  },
  {
    question: "What is your turnaround time for image editing?",
    answer:
      "Standard delivery is usually within 12 to 24 hours, depending on order size and editing requirements. Urgent projects can be prioritized on request.",
  },
  {
    question: "Do you manually edit images or use automated tools?",
    answer:
      "We follow a fully manual Photoshop-based workflow for precise, high-quality results and consistent output across your full catalog.",
  },
  {
    question: "What types of products do you edit for e-commerce?",
    answer:
      "We edit automotive and product images for ecommerce, including cars, parts, accessories, apparel, and other marketplace-ready product photos.",
  },
  {
    question: "How do I send images and place an order?",
    answer:
      "You can send your images through our contact page or free trial form. After reviewing your requirements, we confirm timeline, pricing, and delivery format.",
  },
];

type Props = {
  className?: string;
  items?: FaqItem[];
};

export function FaqSection({ className, items }: Props) {
  const faqItems =
    (items ?? []).filter(
      (item) => item.question.trim().length > 0 && item.answer.trim().length > 0,
    ).length > 0
      ? (items ?? []).filter(
          (item) => item.question.trim().length > 0 && item.answer.trim().length > 0,
        )
      : FAQ_ITEMS;

  return (
    <section
      className={`relative z-20 border-t border-[var(--line)] bg-[var(--background)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20 ${className ?? ""}`}
      aria-labelledby="faq-title"
    >
      <div className="mx-auto grid max-w-[82rem] gap-8 lg:grid-cols-[minmax(320px,0.95fr)_minmax(0,1.45fr)] lg:gap-12 lg:items-start">
        <div>
          <h2
            id="faq-title"
            className={`${display.className} text-balance text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl`}
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Get quick answers about our professional image editing services,
            from affordable pricing and fast turnaround times to our fully
            manual Photoshop process for ecommerce and bulk orders.
          </p>

          <div className="mt-8 rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_92%,black_8%)] p-5 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.7)]">
            <p className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
              Book a Free Consultation
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              Schedule a call with our experts to discuss your requirements and
              receive a personalized quote for your business needs.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[var(--accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--accent-hover)]"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_94%,black_6%)] shadow-[0_10px_30px_-20px_rgba(0,0,0,0.7)]">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group border-b border-[var(--line)]/80 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-[var(--foreground)] transition hover:bg-[color-mix(in_oklab,var(--background)_90%,white_10%)] [&::-webkit-details-marker]:hidden sm:px-6 sm:py-4.5">
                <span className="pr-2 text-[15px] leading-relaxed sm:text-base">{item.question}</span>
                <span className="relative grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--muted)] transition group-open:border-[var(--accent)]/50 group-open:text-[var(--accent)]">
                  <span className="absolute h-0.5 w-3 rounded-full bg-current" />
                  <span className="absolute h-3 w-0.5 rounded-full bg-current transition duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted)] sm:px-6 sm:pb-6">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
