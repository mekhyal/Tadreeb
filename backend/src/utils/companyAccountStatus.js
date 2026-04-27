/**
 * Company portal access (login, post programs).
 * `Approved` exists only on older DB rows; new accounts use `Active` only.
 */
function companyMayUsePortal(status) {
  return status === 'Active';
}

module.exports = { companyMayUsePortal };
