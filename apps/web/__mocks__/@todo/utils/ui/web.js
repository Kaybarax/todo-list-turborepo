// Mock for @todo/utils/ui/web
module.exports = {
  cn: (...classes) => classes.filter(Boolean).join(' '),
  cv: (base, config) => props => base,
  cvm: (variantsFn, options, className) => className || '',
  VariantProps: {},
};
