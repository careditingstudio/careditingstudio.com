import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ServiceFaqSection } from "@/components/ServiceFaqSection";
import { display } from "@/app/fonts";
import {
  isUploadedAsset,
  type PortfolioGridItem,
  type ServicePageBlock,
  type ServicePageContent,
} from "@/lib/cms-types";
import Image from "next/image";

type Props = {
  page: ServicePageContent;
  portfolioItems: PortfolioGridItem[];
};

function spacerClass(size: ServicePageBlock & { type: "spacer" }) {
  switch (size.size) {
    case "sm":
      return "h-4";
    case "lg":
      return "h-16";
    default:
      return "h-8";
  }
}

function PortfolioStrip({
  title,
  items,
}: {
  title: string;
  items: PortfolioGridItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-6">
      {title.trim() ? (
        <h3
          className={`${display.className} text-xl font-semibold text-[var(--foreground)] sm:text-2xl`}
        >
          {title}
        </h3>
      ) : null}
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => (
          <li key={`${item.before}-${item.after}-${idx}`}>
            <BeforeAfterSlider
              layout="portfolio"
              beforeSrc={item.before}
              afterSrc={item.after}
              beforeAlt={item.beforeAlt}
              afterAlt={item.afterAlt}
              priority={idx < 4}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function BlockView({
  block,
  page,
  portfolioItems,
}: {
  block: ServicePageBlock;
  page: ServicePageContent;
  portfolioItems: PortfolioGridItem[];
}) {
  switch (block.type) {
    case "heading": {
      const has =
        block.text.trim().length > 0 || (block.subtext?.trim() ?? "").length > 0;
      if (!has) return null;
      return (
        <section className="space-y-2">
          {block.text.trim() ? (
            <h2
              className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
            >
              {block.text}
            </h2>
          ) : null}
          {block.subtext?.trim() ? (
            <p className="text-[var(--muted)]">{block.subtext}</p>
          ) : null}
        </section>
      );
    }
    case "paragraph": {
      if (!block.text.trim()) return null;
      return (
        <p className="whitespace-pre-wrap text-[var(--muted)] leading-relaxed">
          {block.text}
        </p>
      );
    }
    case "image": {
      if (!block.src.trim()) return null;
      return (
        <figure className="space-y-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-[var(--line)] bg-zinc-100 dark:bg-zinc-900/50">
            <Image
              src={block.src.trim()}
              alt={block.alt.trim() || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 880px"
              unoptimized={isUploadedAsset(block.src.trim())}
            />
          </div>
          {block.caption?.trim() ? (
            <figcaption className="text-center text-sm text-[var(--muted)]">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "portfolio":
      return (
        <PortfolioStrip
          title={block.title ?? page.portfolioTitle}
          items={portfolioItems}
        />
      );
    case "faq":
      return <ServiceFaqSection section={page.faqSection} />;
    case "spacer":
      return <div className={spacerClass(block)} aria-hidden />;
    default:
      return null;
  }
}

export function ServicePageBody({ page, portfolioItems }: Props) {
  const blocks = page.blocks ?? [];
  const hasPortfolio = portfolioItems.length > 0;
  const portfolioInBlocks = blocks.some((b) => b.type === "portfolio");
  const faqInBlocks = blocks.some((b) => b.type === "faq");

  if (blocks.length === 0) {
    const showIntro =
      page.introTitle.trim().length > 0 || page.introBody.trim().length > 0;
    return (
      <div className="space-y-14">
        {showIntro ? (
          <section className="space-y-4">
            {page.introTitle.trim() ? (
              <h2
                className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
              >
                {page.introTitle}
              </h2>
            ) : null}
            {page.introBody.trim() ? (
              <p className="whitespace-pre-wrap text-[var(--muted)] leading-relaxed">
                {page.introBody}
              </p>
            ) : null}
          </section>
        ) : null}
        {hasPortfolio ? (
          <PortfolioStrip title={page.portfolioTitle} items={portfolioItems} />
        ) : null}
        <ServiceFaqSection section={page.faqSection} />
      </div>
    );
  }

  return (
    <div className="space-y-14">
      {blocks.map((block) => (
        <BlockView
          key={block.id}
          block={block}
          page={page}
          portfolioItems={portfolioItems}
        />
      ))}
      {hasPortfolio && !portfolioInBlocks ? (
        <PortfolioStrip title={page.portfolioTitle} items={portfolioItems} />
      ) : null}
      {!faqInBlocks ? <ServiceFaqSection section={page.faqSection} /> : null}
    </div>
  );
}
