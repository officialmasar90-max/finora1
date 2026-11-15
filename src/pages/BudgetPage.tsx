import { Wallet } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

export default function BudgetPage() {
  return (
    <PagePlaceholder
      icon={Wallet}
      title="Perencana Anggaran"
      description="Buat, atur, dan lacak anggaran bulanan Anda per kategori. Dapatkan peringatan ketika pengeluaran mendekati batas yang Anda tetapkan."
      badge="Mengembangan"
    />
  );
}
