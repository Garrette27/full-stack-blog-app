import { useState } from 'react'

export function PasswordInput({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  minLength,
  style = {},
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        style={{
          width: '100%',
          padding: '8px 40px 8px 8px', // Add right padding for the icon
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
          fontSize: '16px',
          ...props.style
        }}
        {...props}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: '#666',
          outline: 'none',
          zIndex: 1
        }}
        onMouseEnter={(e) => e.target.style.color = '#333'}
        onMouseLeave={(e) => e.target.style.color = '#666'}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    </div>
  )
}

