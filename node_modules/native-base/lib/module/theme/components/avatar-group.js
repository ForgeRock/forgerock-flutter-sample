import { mode } from '../tools';

function baseStyle(props) {
  return {
    borderWidth: 2,
    borderColor: mode('gray.50', 'gray.800')(props),
    bg: mode('gray.600', 'gray.100')(props),
    space: -4
  };
}

export default {
  baseStyle
};
//# sourceMappingURL=avatar-group.js.map