import React from 'react';

export default function LoginButton({ text, onClick }) {
  return <button onClick={onClick}>{text}</button>;
}
