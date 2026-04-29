/** Company account states stored on `Company.status`. Legacy rows may still have Approved / Review. */

export function normalizeCompanyAccountStatus(raw) {
  const s = raw == null ? '' : String(raw);
  if (s === 'Active' || s === 'Approved') return 'Active';
  if (s === 'Inactive') return 'Inactive';
  if (s === 'Rejected') return 'Rejected';
  return 'Pending';
}
