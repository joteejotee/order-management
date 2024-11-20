import React from 'react'

interface InputErrorProps {
  messages?: string[] // messagesの型をstring[]に指定
  className?: string
}

const InputError: React.FC<InputErrorProps> = ({
  messages = [],
  className = '',
}) => (
  <>
    {messages && messages.length > 0 && (
      <>
        {messages.map((message, index) => (
          <p className={`${className} text-sm text-red-600`} key={index}>
            {message}
          </p>
        ))}
      </>
    )}
  </>
)

export default InputError
