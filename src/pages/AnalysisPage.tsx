import { TrendingUp } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

export default function AnalysisPage() {
  return (
    <PagePlaceholder
      icon={TrendingUp}
      title="Analisis Keuangan"
      description="Visualisasi mendalam tentang pola pengeluaran, tren pemasukan, dan kesehatan keuangan Anda dengan grafik interaktif yang mudah dipahami."
      badge="Mengembangan"
    />
  );
}
