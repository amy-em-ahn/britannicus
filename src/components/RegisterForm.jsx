import React from 'react';
import Button from './ui/Button';
import Input from './ui/Input';

export default function RegisterForm({handleFunction, darkMode}) {
  let background = ''
  if (darkMode) {
    background = 'bg-slate-700'
  } else {
    background = 'bg-white'
  }
  return (
    <div className={`grid w-1/4 border-slate-900 border-2 mx-auto p-5 rounded-lg ${background} pt-10`}>
      <h1 className={darkMode ? "text-2xl text-center text-white" : "text-2xl text-center"}>Register here!</h1>
      <h2 className={darkMode ? "text-xl text-white" : "text-xl"}>Enter your name...</h2>
      <Input type='text' placeholder='name' className={darkMode ? "bg-slate-400" : "bg-white"}/>
      <h2 className={darkMode ? "text-xl text-white" : "text-xl"}>Enter your type...</h2>
      <Input type='text' placeholder='type' className={darkMode ? "bg-slate-400" : "bg-white"}/>
      <h2 className={darkMode ? "text-xl text-white" : "text-xl"}>Enter your email...</h2>
      <Input type='text' placeholder='email' className={darkMode ? "bg-slate-400" : "bg-white"}/>
      <h2 className={darkMode ? "text-xl text-white" : "text-xl"}>Enter your phone...</h2>
      <Input type='text' placeholder='phone' className={darkMode ? "bg-slate-400" : "bg-white"}/>
      <Button text="Register" onClick={handleFunction} className={'mt-5'}/>
    </div>
  );
}
