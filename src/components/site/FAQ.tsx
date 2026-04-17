import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export type FAQItem = { q: string; a: string };

export function FAQ({ title = "Frequently asked questions", subtitle, items }: { title?: string; subtitle?: string; items: FAQItem[] }) {
  return (
    <section className="bg-background py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
