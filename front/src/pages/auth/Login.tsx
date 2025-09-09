import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import { toast, ToastContainer } from 'react-toastify';

export default function Login() {
  const [loginForm, setLoginForm] = useState<{email: string, password: string}>({
    'email': '',
    'password': ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(loginForm.email && loginForm.password){
      console.log(loginForm)
    }else{
      toast.error("Veuillez remplir tous les champs" , {position: "top-center" , autoClose: 2000} )

    }
  }

  return (
    <div className="flex flex-col items-center">
        <img className='w-1/4 items-center' src={Logo} alt="" />
      <h1 className="text-4xl font-bold mb-10">Connexion</h1>
      <form onSubmit={handleSubmit} className="w-1/2">
        <label htmlFor="email" className="block mb-2">
          Email :
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={loginForm.email}
          onChange={handleChange}
          className="border-2 p-2 mb-4 w-full"
        />
        <br />
        <label htmlFor="password" className="block mb-2">
          Mot de passe :
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={loginForm.password}
          onChange={handleChange}
          className="border-2 p-2 mb-4 w-full"
        />
        <br />
        <p className="mt-4">
        Pas encore de compte ? <Link to="/signup" className="text-blue-500">Inscrivez-vous</Link>
      </p>
      <br />
        <input
          type="submit"
          value="Se connecter"
          className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
      </form>
      
      <ToastContainer />
    </div>
  )
}

