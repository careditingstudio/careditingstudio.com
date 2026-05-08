import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import {
  CompactFeatureCardsBlock,
  ContentWideBlock,
  FeatureCardsBlock,
  IconGridBlock,
  PillChecklistBlock,
  SupportCardsStripBlock,
  SplitPillColumnsBlock,
  SplitShowcaseBlock,
  TickChecklistBlock,
  ValueColumnsBlock,
} from "@/components/ServicePageSections";
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

function splitParagraph(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const bullets = lines
    .filter((line) => line.startsWith("- ") || line.startsWith("* "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
  const body = lines.filter(
    (line) => !line.startsWith("- ") && !line.startsWith("* "),
  );

  return { bullets, body };
}

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

function SectionShell({
  children,
  emphasize = false,
}: {
  children: React.ReactNode;
  emphasize?: boolean;
}) {
  return (
    <section
      className={[
        "rounded-2xl border px-5 py-6 sm:px-7 sm:py-8",
        emphasize
          ? "border-[var(--line)] bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/85 dark:to-zinc-900/40"
          : "border-[var(--line)]/70 bg-zinc-50/50 dark:bg-zinc-900/25",
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function PortfolioStrip({
  title,
  items,
  sideTitle,
  sideText,
}: {
  title: string;
  items: PortfolioGridItem[];
  sideTitle?: string;
  sideText?: string;
}) {
  if (items.length === 0) return null;
  const hasSideText = Boolean(sideTitle?.trim() || sideText?.trim());
  const lead = items[0];
  const rest = hasSideText ? items.slice(1) : items;
  return (
    <SectionShell emphasize>
      <div className="space-y-6">
      {title.trim() ? (
        <h3
          className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
        >
          {title}
        </h3>
      ) : null}
      {hasSideText && lead ? (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-8">
          <div className="max-w-[340px]">
            <BeforeAfterSlider
              layout="portfolio"
              beforeSrc={lead.before}
              afterSrc={lead.after}
              beforeAlt={lead.beforeAlt}
              afterAlt={lead.afterAlt}
              priority
            />
          </div>
          <div className="space-y-3">
            {sideTitle?.trim() ? (
              <h4
                className={`${display.className} text-xl font-semibold text-[var(--foreground)] sm:text-2xl`}
              >
                {sideTitle}
              </h4>
            ) : null}
            {sideText?.trim() ? (
              <p className="whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
                {sideText}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      {rest.length > 0 ? (
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((item, idx) => (
            <li key={`${item.before}-${item.after}-${idx}`}>
              <BeforeAfterSlider
                layout="portfolio"
                beforeSrc={item.before}
                afterSrc={item.after}
                beforeAlt={item.beforeAlt}
                afterAlt={item.afterAlt}
                priority={idx < 3}
              />
            </li>
          ))}
        </ul>
      ) : null}
      </div>
    </SectionShell>
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
        <SectionShell emphasize>
          <div className="space-y-3">
            {block.text.trim() ? (
              <h2
                className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
              >
                {block.text}
              </h2>
            ) : null}
            {block.subtext?.trim() ? (
              <p className="max-w-3xl text-[var(--muted)]">{block.subtext}</p>
            ) : null}
          </div>
        </SectionShell>
      );
    }
    case "paragraph": {
      if (!block.text.trim()) return null;
      const { body, bullets } = splitParagraph(block.text);
      return (
        <SectionShell>
          <div className="space-y-5">
            {body.length > 0 ? (
              <p className="whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
                {body.join("\n")}
              </p>
            ) : null}
            {bullets.length > 0 ? (
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {bullets.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-[var(--line)] bg-zinc-100/60 px-4 py-2 text-sm text-[var(--foreground)] dark:bg-zinc-800/60"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </SectionShell>
      );
    }
    case "image": {
      if (!block.src.trim()) return null;
      return (
        <SectionShell>
          <figure className="space-y-3">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-zinc-100 dark:bg-zinc-900/50">
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
        </SectionShell>
      );
    }
    case "portfolio":
      return (
        <PortfolioStrip
          title={block.title ?? page.portfolioTitle}
          items={portfolioItems}
          sideTitle={block.sideTitle}
          sideText={block.sideText}
        />
      );
    case "faq":
      return (
        <SectionShell>
          <ServiceFaqSection section={page.faqSection} />
        </SectionShell>
      );
    case "spacer":
      return (
        <div className="px-2">
          <div className={spacerClass(block)} aria-hidden />
        </div>
      );
    case "featureCards":
      return (
        <FeatureCardsBlock
          sectionTitle={block.sectionTitle}
          sectionSubtext={block.sectionSubtext}
          cards={block.cards}
        />
      );
    case "splitShowcase":
      return (
        <SplitShowcaseBlock
          title={block.title}
          body={block.body}
          imageSrc={block.imageSrc}
          imageAlt={block.imageAlt}
          imageRight={block.imageRight}
        />
      );
    case "pillChecklist":
      return (
        <PillChecklistBlock
          title={block.title}
          subtext={block.subtext}
          pills={block.pills}
          checks={block.checks}
        />
      );
    case "tickChecklist":
      return (
        <TickChecklistBlock
          title={block.title}
          subtext={block.subtext}
          items={block.items}
          columns={block.columns}
        />
      );
    case "valueColumns":
      return (
        <ValueColumnsBlock
          eyebrow={block.eyebrow}
          title={block.title}
          body={block.body}
          columns={block.columns}
        />
      );
    case "supportCards":
      return (
        <SupportCardsStripBlock
          eyebrow={block.eyebrow}
          title={block.title}
          body={block.body}
          cards={block.cards}
        />
      );
    case "iconGrid":
      return (
        <IconGridBlock
          title={block.title}
          subtext={block.subtext}
          items={block.items}
        />
      );
    case "compactFeatureCards":
      return (
        <CompactFeatureCardsBlock
          title={block.title}
          subtext={block.subtext}
          items={block.items}
        />
      );
    case "splitPillColumns":
      return (
        <SplitPillColumnsBlock
          titleLeft={block.titleLeft}
          titleRight={block.titleRight}
          pillsLeft={block.pillsLeft}
          pillsRight={block.pillsRight}
        />
      );
    case "contentWide":
      return <ContentWideBlock title={block.title} body={block.body} />;
    default:
      return null;
  }
}

function IntroFallback({ page }: { page: ServicePageContent }) {
  const showIntro =
    page.introTitle.trim().length > 0 || page.introBody.trim().length > 0;
  if (!showIntro) return null;

  const { body, bullets } = splitParagraph(page.introBody);
  return (
    <SectionShell emphasize>
      <div className="space-y-5">
        {page.introTitle.trim() ? (
          <h2
            className={`${display.className} text-2xl font-semibold text-[var(--foreground)] sm:text-3xl`}
          >
            {page.introTitle}
          </h2>
        ) : null}
        {body.length > 0 ? (
          <p className="whitespace-pre-wrap leading-relaxed text-[var(--muted)]">
            {body.join("\n")}
          </p>
        ) : null}
        {bullets.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {bullets.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[var(--line)] bg-zinc-100/60 px-4 py-2 text-sm text-[var(--foreground)] dark:bg-zinc-800/60"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </SectionShell>
  );
}

export function ServicePageBody({ page, portfolioItems }: Props) {
  const blocks = page.blocks ?? [];
  const faqInBlocks = blocks.some((b) => b.type === "faq");

  if (blocks.length === 0) {
    return <IntroFallback page={page} />;
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
      {!faqInBlocks ? (
        <SectionShell>
          <ServiceFaqSection section={page.faqSection} />
        </SectionShell>
      ) : null}
    </div>
  );
}
