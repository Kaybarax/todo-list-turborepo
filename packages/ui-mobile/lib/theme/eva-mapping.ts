/**
 * Custom Eva Design Mapping
 * Maps design tokens to Eva Design component styles
 */

// Define the mapping type based on Eva Design structure
interface CustomMappingType {
  strict: Record<string, string>;
  components: Record<string, any>;
}

export const customMapping: CustomMappingType = {
  strict: {
    // Button mappings
    'color-primary-default': 'color-primary-600',
    'color-primary-hover': 'color-primary-700',
    'color-primary-active': 'color-primary-800',
    'color-primary-disabled': 'color-primary-300',
    'color-primary-focus': 'color-primary-600',

    // Success mappings
    'color-success-default': 'color-success-600',
    'color-success-hover': 'color-success-700',
    'color-success-active': 'color-success-800',
    'color-success-disabled': 'color-success-300',
    'color-success-focus': 'color-success-600',

    // Info mappings
    'color-info-default': 'color-info-600',
    'color-info-hover': 'color-info-700',
    'color-info-active': 'color-info-800',
    'color-info-disabled': 'color-info-300',
    'color-info-focus': 'color-info-600',

    // Warning mappings
    'color-warning-default': 'color-warning-600',
    'color-warning-hover': 'color-warning-700',
    'color-warning-active': 'color-warning-800',
    'color-warning-disabled': 'color-warning-300',
    'color-warning-focus': 'color-warning-600',

    // Danger mappings
    'color-danger-default': 'color-danger-600',
    'color-danger-hover': 'color-danger-700',
    'color-danger-active': 'color-danger-800',
    'color-danger-disabled': 'color-danger-300',
    'color-danger-focus': 'color-danger-600',

    // Typography mappings
    'text-font-family': 'text-font-family',
    'text-font-size': 'text-font-size',
    'text-font-weight': 'text-font-weight',
    'text-line-height': 'text-line-height',

    // Heading mappings
    'text-heading-1-font-size': 'text-heading-1-font-size',
    'text-heading-1-font-weight': 'text-heading-1-font-weight',
    'text-heading-2-font-size': 'text-heading-2-font-size',
    'text-heading-2-font-weight': 'text-heading-2-font-weight',
    'text-heading-3-font-size': 'text-heading-3-font-size',
    'text-heading-3-font-weight': 'text-heading-3-font-weight',
    'text-heading-4-font-size': 'text-heading-4-font-size',
    'text-heading-4-font-weight': 'text-heading-4-font-weight',
    'text-heading-5-font-size': 'text-heading-5-font-size',
    'text-heading-5-font-weight': 'text-heading-5-font-weight',
    'text-heading-6-font-size': 'text-heading-6-font-size',
    'text-heading-6-font-weight': 'text-heading-6-font-weight',

    // Background mappings
    'background-basic-color-1': 'background-basic-color-1',
    'background-basic-color-2': 'background-basic-color-2',
    'background-basic-color-3': 'background-basic-color-3',
    'background-basic-color-4': 'background-basic-color-4',

    // Border mappings
    'border-basic-color-1': 'border-basic-color-1',
    'border-basic-color-2': 'border-basic-color-2',
    'border-basic-color-3': 'border-basic-color-3',
    'border-basic-color-4': 'border-basic-color-4',
    'border-basic-color-5': 'border-basic-color-5',

    // Text color mappings
    'text-basic-color': 'text-basic-color',
    'text-alternate-color': 'text-alternate-color',
    'text-control-color': 'text-control-color',
    'text-disabled-color': 'text-disabled-color',
    'text-hint-color': 'text-hint-color',
  },
  components: {
    Button: {
      meta: {
        parameters: {
          textMarginHorizontal: {
            type: 'number',
          },
          iconMarginHorizontal: {
            type: 'number',
          },
        },
        appearances: {
          filled: {
            default: true,
          },
          outline: {
            default: false,
          },
          ghost: {
            default: false,
          },
        },
        variantGroups: {
          status: {
            primary: {
              default: true,
            },
            success: {
              default: false,
            },
            info: {
              default: false,
            },
            warning: {
              default: false,
            },
            danger: {
              default: false,
            },
            basic: {
              default: false,
            },
            control: {
              default: false,
            },
          },
          size: {
            tiny: {
              default: false,
            },
            small: {
              default: false,
            },
            medium: {
              default: true,
            },
            large: {
              default: false,
            },
            giant: {
              default: false,
            },
          },
        },
        states: {
          focused: {
            default: false,
            priority: 1,
            scope: 'all',
          },
          disabled: {
            default: false,
            priority: 2,
            scope: 'all',
          },
          active: {
            default: false,
            priority: 0,
            scope: 'all',
          },
          hover: {
            default: false,
            priority: 0,
            scope: 'all',
          },
        },
      },
      appearances: {
        filled: {
          mapping: {
            backgroundColor: 'color-primary-default',
            borderColor: 'color-primary-default',
            textColor: 'text-control-color',
          },
          variantGroups: {
            status: {
              primary: {
                backgroundColor: 'color-primary-default',
                borderColor: 'color-primary-default',
                textColor: 'text-control-color',
              },
              success: {
                backgroundColor: 'color-success-default',
                borderColor: 'color-success-default',
                textColor: 'text-control-color',
              },
              info: {
                backgroundColor: 'color-info-default',
                borderColor: 'color-info-default',
                textColor: 'text-control-color',
              },
              warning: {
                backgroundColor: 'color-warning-default',
                borderColor: 'color-warning-default',
                textColor: 'text-control-color',
              },
              danger: {
                backgroundColor: 'color-danger-default',
                borderColor: 'color-danger-default',
                textColor: 'text-control-color',
              },
            },
          },
        },
        outline: {
          mapping: {
            backgroundColor: 'transparent',
            borderColor: 'color-primary-default',
            textColor: 'color-primary-default',
          },
          variantGroups: {
            status: {
              primary: {
                backgroundColor: 'transparent',
                borderColor: 'color-primary-default',
                textColor: 'color-primary-default',
              },
              success: {
                backgroundColor: 'transparent',
                borderColor: 'color-success-default',
                textColor: 'color-success-default',
              },
              info: {
                backgroundColor: 'transparent',
                borderColor: 'color-info-default',
                textColor: 'color-info-default',
              },
              warning: {
                backgroundColor: 'transparent',
                borderColor: 'color-warning-default',
                textColor: 'color-warning-default',
              },
              danger: {
                backgroundColor: 'transparent',
                borderColor: 'color-danger-default',
                textColor: 'color-danger-default',
              },
            },
          },
        },
        ghost: {
          mapping: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            textColor: 'color-primary-default',
          },
          variantGroups: {
            status: {
              primary: {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: 'color-primary-default',
              },
              success: {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: 'color-success-default',
              },
              info: {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: 'color-info-default',
              },
              warning: {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: 'color-warning-default',
              },
              danger: {
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                textColor: 'color-danger-default',
              },
            },
          },
        },
      },
    },
    Text: {
      meta: {
        parameters: {},
        appearances: {
          default: {
            default: true,
          },
        },
        variantGroups: {
          category: {
            h1: {
              default: false,
            },
            h2: {
              default: false,
            },
            h3: {
              default: false,
            },
            h4: {
              default: false,
            },
            h5: {
              default: false,
            },
            h6: {
              default: false,
            },
            s1: {
              default: false,
            },
            s2: {
              default: false,
            },
            p1: {
              default: true,
            },
            p2: {
              default: false,
            },
            c1: {
              default: false,
            },
            c2: {
              default: false,
            },
            label: {
              default: false,
            },
          },
          status: {
            basic: {
              default: true,
            },
            primary: {
              default: false,
            },
            success: {
              default: false,
            },
            info: {
              default: false,
            },
            warning: {
              default: false,
            },
            danger: {
              default: false,
            },
            control: {
              default: false,
            },
          },
        },
        states: {},
      },
      appearances: {
        default: {
          mapping: {
            color: 'text-basic-color',
            fontFamily: 'text-font-family',
            fontSize: 'text-font-size',
            fontWeight: 'text-font-weight',
          },
          variantGroups: {
            category: {
              h1: {
                fontSize: 'text-heading-1-font-size',
                fontWeight: 'text-heading-1-font-weight',
              },
              h2: {
                fontSize: 'text-heading-2-font-size',
                fontWeight: 'text-heading-2-font-weight',
              },
              h3: {
                fontSize: 'text-heading-3-font-size',
                fontWeight: 'text-heading-3-font-weight',
              },
              h4: {
                fontSize: 'text-heading-4-font-size',
                fontWeight: 'text-heading-4-font-weight',
              },
              h5: {
                fontSize: 'text-heading-5-font-size',
                fontWeight: 'text-heading-5-font-weight',
              },
              h6: {
                fontSize: 'text-heading-6-font-size',
                fontWeight: 'text-heading-6-font-weight',
              },
              s1: {
                fontSize: 'text-subtitle-1-font-size',
                fontWeight: 'text-subtitle-1-font-weight',
              },
              s2: {
                fontSize: 'text-subtitle-2-font-size',
                fontWeight: 'text-subtitle-2-font-weight',
              },
              p1: {
                fontSize: 'text-paragraph-1-font-size',
                fontWeight: 'text-paragraph-1-font-weight',
              },
              p2: {
                fontSize: 'text-paragraph-2-font-size',
                fontWeight: 'text-paragraph-2-font-weight',
              },
              c1: {
                fontSize: 'text-caption-1-font-size',
                fontWeight: 'text-caption-1-font-weight',
              },
              c2: {
                fontSize: 'text-caption-2-font-size',
                fontWeight: 'text-caption-2-font-weight',
              },
              label: {
                fontSize: 'text-label-font-size',
                fontWeight: 'text-label-font-weight',
              },
            },
            status: {
              basic: {
                color: 'text-basic-color',
              },
              primary: {
                color: 'color-primary-default',
              },
              success: {
                color: 'color-success-default',
              },
              info: {
                color: 'color-info-default',
              },
              warning: {
                color: 'color-warning-default',
              },
              danger: {
                color: 'color-danger-default',
              },
              control: {
                color: 'text-control-color',
              },
            },
          },
        },
      },
    },
  },
};
