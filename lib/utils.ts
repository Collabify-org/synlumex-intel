import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: 'INR' | 'USD' | 'SAR'
): string {
  if (currency === 'INR') {
    if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
    if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  if (currency === 'USD') {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
    return `$${amount.toLocaleString('en-US')}`;
  }
  if (currency === 'SAR') {
    if (amount >= 1_000_000) return `﷼${(amount / 1_000_000).toFixed(2)}M`;
    if (amount >= 1_000) return `﷼${(amount / 1_000).toFixed(1)}K`;
    return `﷼${amount.toLocaleString('en-US')}`;
  }
  return amount.toString();
}
