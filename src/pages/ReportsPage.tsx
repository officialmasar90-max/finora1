import { FileBarChart } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

export default function ReportsPage() {
  return (
    <PagePlaceholder
      icon={FileBarChart}
      title="Laporan Keuangan"
      description="Hasilkan laporan keuangan periodik yang komprehensif. Unduh ringkasan mingguan, bulanan, atau tahunan dalam format yang mudah dibaca."
      badge="Mengembangan"
    />
  );
}
