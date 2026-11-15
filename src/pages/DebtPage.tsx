import { CreditCard } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

export default function DebtPage() {
  return (
    <PagePlaceholder
      icon={CreditCard}
      title="Manajemen Utang"
      description="Kelola semua utang Anda dalam satu tempat. Lacak jadwal pembayaran, bunga, dan strategi pelunasan untuk menjadi bebas utang lebih cepat."
      badge="Mengembangan"
    />
  );
}
