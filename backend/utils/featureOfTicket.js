export const formatVND = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' vnđ';
};
