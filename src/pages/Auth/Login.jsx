import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from '../../components/ui/Button';
import { useAuthContext } from '../../components/context/AuthContext';
import Input from '../../components/ui/Input';
import { Navigate } from 'react-router-dom';

export default function Login({ handleFunction, darkMode }) {
  const { user, login } = useAuthContext();

  // google login
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    login().finally(() => {
      setIsLoggingIn(false);
    });
  };

  // end of google login

  let background = '';
  if (darkMode) {
    background = 'bg-slate-700';
  } else {
    background = 'bg-white';
  }

  return (
    <>
      <Helmet>
        <title>Login | Britannicus BMS</title>
      </Helmet>
      <div
        className={`grid w-1/4 min-w-[400px] border-slate-900 border-2 mx-auto p-5 rounded-lg ${background} pt-10`}
      >
        <h1
          className={
            darkMode
              ? 'text-2xl text-center text-white'
              : 'text-2xl text-center'
          }
        >
          Login here!
        </h1>
        <h2 className={darkMode ? 'text-xl text-white' : 'text-xl'}>
          Enter your email...
        </h2>
        <Input
          type='email'
          placeholder='email'
          className={darkMode ? 'bg-slate-400' : 'bg-white'}
        />
        <h2 className={darkMode ? 'text-xl text-white' : 'text-xl'}>
          Enter your password...
        </h2>
        <Input
          type='password'
          placeholder='password'
          className={darkMode ? 'bg-slate-400' : 'bg-white'}
        />
        <Button text='Login' onClick={handleFunction} className={'mt-5'} />
        <div className='w-full border-b-2 border-slate-900 my-2' />
        <h2 className={darkMode ? 'text-xl text-white' : 'text-xl'}>
          Other Options
        </h2>
        <Button
          icon={'FaGoogle'}
          text={isLoggingIn ? 'Signing in...' : 'Sign in using Google'}
          onClick={handleGoogleLogin} // google login
          disabled={isLoggingIn}
        />
      </div>
      {user ? <Navigate to={'/'} /> : ''}
    </>
  );
}
