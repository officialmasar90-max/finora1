import { Bot } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

export default function AIConsultantPage() {
  return (
    <PagePlaceholder
      icon={Bot}
      title="Konsultan AI"
      description="Dapatkan saran keuangan personal yang cerdas dari asisten AI. Tanyakan apa saja tentang anggaran, investasi, dan strategi menabung Anda."
      badge="AI-Powered"
    />
  );
}
