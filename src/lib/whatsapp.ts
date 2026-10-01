export const SALES_WHATSAPP_NUMBER = '5521996589629';
export const SALES_WHATSAPP_DISPLAY = '(21) 99658-9629';

export function normalizeWhatsAppNumber(phone?: string): string {
  if (!phone || phone.includes('11999999999')) {
    return SALES_WHATSAPP_NUMBER;
  }
  const digits = phone.replace(/\D/g, '');
  if (!digits) return SALES_WHATSAPP_NUMBER;
  if (digits.startsWith('55')) return digits;
  return `55${digits}`;
}

export function formatWhatsAppLink(phone: string | undefined, message: string): string {
  const clean = normalizeWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(message);
  // wa.me is the universal direct link standard
  return `https://wa.me/${clean}?text=${encodedText}`;
}
