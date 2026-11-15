import { ArrowRightLeft } from 'lucide-react';
import PagePlaceholder from '@/components/PagePlaceholder';

export default function TransactionsPage() {
  return (
    <PagePlaceholder
      icon={ArrowRightLeft}
      title="Transaksi"
      description="Catat dan pantau semua pemasukan serta pengeluaran Anda dalam satu daftar yang terorganisir dengan filter dan kategori lengkap."
      badge="Mengembangan"
    />
  );
}
