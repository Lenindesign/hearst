import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HearstEventDetail } from "@/components/hearst-plus/events/hearst-events-experience";
import { ThemeProvider } from "@/components/theme-provider";
import { getHearstEvent, hearstEvents } from "@/lib/hearst-events";

type PageProps = {
  params: Promise<{ eventSlug: string }>;
};

export function generateStaticParams() {
  return hearstEvents.map((event) => ({ eventSlug: event.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = getHearstEvent(eventSlug);
  if (!event) return { title: "Event not found | Hearst+" };
  return {
    title: `${event.title} | Hearst+ Events`,
    description: event.summary,
  };
}

export default async function HearstEventPage({ params }: PageProps) {
  const { eventSlug } = await params;
  const event = getHearstEvent(eventSlug);
  if (!event) notFound();

  return (
    <ThemeProvider defaultBrandSlug={event.primaryBrandSlug}>
      <HearstEventDetail event={event} />
    </ThemeProvider>
  );
}
