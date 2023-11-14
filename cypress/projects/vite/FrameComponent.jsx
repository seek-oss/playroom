const parent = {
  border: '1px solid currentColor',
  padding: '10px 10px 10px 15px',
};

const FrameComponent = ({ theme, children }) => (
  <div>
    FrameComponent (theme: &quot;{theme.name}&quot;)
    {children ? <div style={parent}>{children}</div> : null}
  </div>
);

export default FrameComponent
