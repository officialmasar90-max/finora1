import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Info } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import SectionCard from '@/components/dashboard/SectionCard';
import EmptyState from '@/components/dashboard/EmptyState';
import MonthFilter from '@/components/dashboard/MonthFilter';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import CategoryBreakdownChart from '@/components/dashboard/CategoryBreakdownChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import FinancialHealth from '@/components/dashboard/FinancialHealth';
import {
  months,
  defaultMonth,
  monthlyData,
  monthlySummary,
  categoryBreakdown,
  transactions,
  healthMetrics,
} from '@/data/sampleData';
import { formatIDR } from '@/utils/format';
import { Inbox } from 'lucide-react';

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const summary = monthlySummary[selectedMonth];
  const categories = categoryBreakdown[selectedMonth] ?? [];
  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.monthKey === selectedMonth),
    [selectedMonth]
  );
  const metrics = healthMetrics[selectedMonth] ?? [];

  const incomeChange = summary
    ? Math.round(((summary.income - summary.prevIncome) / summary.prevIncome) * 100)
    : 0;
  const expenseChange = summary
    ? Math.round(((summary.expense - summary.prevExpense) / summary.prevExpense) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header with month filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Dasbor Keuangan</h2>
          <p className="text-sm text-gray-500 mt-1">
            Ringkasan kondisi keuangan Anda secara menyeluruh
          </p>
        </div>
        <MonthFilter
          months={months}
          value={selectedMonth}
          onChange={setSelectedMonth}
        />
      </div>

      {/* Demo data notice */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-sm text-emerald-800">
          <span className="font-semibold">Data demonstrasi.</span> Semua angka di bawah ini adalah
          contoh data dan bukan catatan keuangan sungguhana Anda.
        </p>
      </div>

      {/* 1-4: Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Pemasukan"
          value={summary.income}
          change={incomeChange}
          icon={TrendingUp}
          accent="from-emerald-500 to-emerald-700"
        />
        <StatCard
          label="Total Pengeluaran"
          value={summary.expense}
          change={expenseChange}
          icon={TrendingDown}
          accent="from-navy-700 to-navy-900"
          invertChange
        />
        <StatCard
          label="Saldo Saat Ini"
          value={summary.balance}
          change={incomeChange - expenseChange}
          icon={Wallet}
          accent="from-gray-600 to-gray-800"
        />
        <StatCard
          label="Tingkat Tabungan"
          value={summary.savingsRate}
          change={3}
          icon={PiggyBank}
          accent="from-emerald-600 to-navy-800"
          isCurrency={false}
          suffix="%"
        />
      </div>

      {/* 5 & 6: Income vs Expense chart + Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <SectionCard
          title="Pemasukan vs Pengeluaran"
          subtitle="Tren 6 bulan terakhir"
          className="lg:col-span-3"
        >
          <IncomeExpenseChart data={monthlyData} highlightKey={selectedMonth} />
        </SectionCard>

        <SectionCard
          title="Rincian Kategori"
          subtitle="Pengeluaran per kategori bulan ini"
          className="lg:col-span-2"
        >
          {categories.length > 0 ? (
            <CategoryBreakdownChart data={categories} />
          ) : (
            <EmptyState
              icon={Inbox}
              title="Belum ada data kategori"
              description="Data kategori pengeluaran akan muncul di sini."
            />
          )}
        </SectionCard>
      </div>

      {/* 7 & 8: Recent transactions + Financial health */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <SectionCard
          title="Transaksi Terbaru"
          subtitle={`${monthTransactions.length} transaksi bulan ini`}
          className="lg:col-span-3"
        >
          <RecentTransactions transactions={monthTransactions} maxItems={6} />
        </SectionCard>

        <SectionCard
          title="Kesehatan Keuangan"
          subtitle="Ringkasan metrik keuangan"
          className="lg:col-span-2"
        >
          {metrics.length > 0 ? (
            <FinancialHealth metrics={metrics} monthKey={selectedMonth} />
          ) : (
            <EmptyState
              icon={Inbox}
              title="Belum ada metrik"
              description="Metrik kesehatan keuangan akan muncul di sini."
            />
          )}
        </SectionCard>
      </div>

      {/* Balance summary bar */}
      <div className="rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 p-6 text-white shadow-card-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-navy-300">Saldo Bersih Bulan Ini</p>
            <p className="mt-1 text-3xl font-extrabold">{formatIDR(summary.balance)}</p>
            <p className="mt-1 text-sm text-emerald-400">
              Tingkat tabungan {summary.savingsRate}% dari pemasukan
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8">
            <div className="text-center">
              <p className="text-xs text-navy-300">Pemasukan</p>
              <p className="text-lg font-bold text-emerald-400">{formatIDR(summary.income)}</p>
            </div>
            <div className="h-12 w-px bg-navy-600 hidden sm:block" />
            <div className="text-center">
              <p className="text-xs text-navy-300">Pengeluaran</p>
              <p className="text-lg font-bold text-white">{formatIDR(summary.expense)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
