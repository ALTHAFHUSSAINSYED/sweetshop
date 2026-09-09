export const SHOP_UPI_ID = 'Q396308303@ybl';
export const SHOP_NAME = 'Palnadu Sweets';

export function buildUpiUri(amount, orderNumber) {
  return (
    'upi://pay?pa=' + SHOP_UPI_ID +
    '&pn=' + encodeURIComponent(SHOP_NAME) +
    '&am=' + amount +
    '&tr=' + encodeURIComponent(orderNumber) +
    '&tn=' + encodeURIComponent('Payment for Order ' + orderNumber) +
    '&cu=INR'
  );
}