export function isPaymentsOnlyUser(user) {
  return user?.email?.trim().toLowerCase() === 'nutri@dharma.com';
}
