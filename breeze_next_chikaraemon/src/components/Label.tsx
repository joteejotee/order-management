interface LabelProps {
  className?: string; // 必須ではなくオプションに変更
  children: React.ReactNode;
  [x: string]: any; // 他のプロパティも許可
}

const Label = ({ className = '', children, ...props }: LabelProps) => (
  <label
    className={`${className} block font-medium text-sm text-gray-700`}
    {...props}
  >
    {children}
  </label>
);

export default Label;
