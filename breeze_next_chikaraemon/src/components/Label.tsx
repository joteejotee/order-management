interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label = ({ children, ...props }: LabelProps) => (
  <label {...props}>{children}</label>
);

export { Label };
