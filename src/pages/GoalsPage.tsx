import { Target } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

export default function GoalsPage() {
  return (
    <PagePlaceholder
      icon={Target}
      title="Tujuan Keuangan"
      description="Tetapkan target tabungan dan pantau progres pencapaian Anda. Dari dana darurat hingga liburan impian, capai tujuan keuangan Anda selangkah demi selangkah."
      badge="Mengembangan"
    />
  );
}
