import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { INITIAL_IPOS } from '@/data/mockIpos';
import IpoDetailClient from './IpoDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ipo = INITIAL_IPOS.find((i) => i.slug === slug);

  if (!ipo) {
    return {
      title: 'IPO Not Found — IPOAlerts',
    };
  }

  return {
    title: `${ipo.name} IPO GMP Today, Subscription Status & Review (2026)`,
    description: `Check live ${ipo.name} Grey Market Premium (GMP ₹${ipo.currentGmp}), Day-wise bidding subscription, expected listing gain (+${ipo.currentListingGainPct}%), financials, and allotment status link.`,
  };
}

export default async function IpoDetailPage({ params }: Props) {
  const { slug } = await params;
  const initialIpo = INITIAL_IPOS.find((i) => i.slug === slug);

  if (!initialIpo) {
    notFound();
  }

  return <IpoDetailClient initialIpo={initialIpo} slug={slug} />;
}
