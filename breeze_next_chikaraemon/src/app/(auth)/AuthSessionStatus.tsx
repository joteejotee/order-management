import React from 'react';

interface AuthSessionStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  status: string | null;
}

const AuthSessionStatus = ({
  status,
  className = '',
  ...props
}: AuthSessionStatusProps) => {
  if (!status) return null;
  return (
    <div className={className} {...props}>
      {status}
    </div>
  );
};

export default AuthSessionStatus;
