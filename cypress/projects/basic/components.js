import PropTypes from 'prop-types';

const withPropTypes = (component) => {
  component.propTypes = {
    className: PropTypes.string,
    color: PropTypes.oneOf(['red', 'blue']),
    children: PropTypes.node,
  };

  return component;
};
const parent = {
  border: '1px solid currentColor',
  padding: '10px 10px 10px 15px',
};

export const Foo = withPropTypes(({ className, color = 'black', children }) => (
  <div className={className} style={{ color }}>
    Foo{children ? <div style={parent}>{children}</div> : null}
  </div>
));

export const Bar = withPropTypes(({ className, color = 'black', children }) => (
  <div className={className} style={{ color }}>
    Bar{children ? <div style={parent}>{children}</div> : null}
  </div>
));
