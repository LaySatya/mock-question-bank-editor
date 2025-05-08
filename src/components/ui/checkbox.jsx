export const Checkbox = ({ className = '', ...props }) => {
    return <input type="checkbox" className={`checkbox ${className}`} {...props} />;
  };
  