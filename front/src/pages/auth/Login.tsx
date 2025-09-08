import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.png'
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
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

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if(loginForm.email && loginForm.password){
        const res = await axios.post(`${import.meta.env.VITE_API_URL}`, loginForm, {withCredentials: true});
        if(res.status === 200){
          toast.success("Connexion réussie" , {position: "top-center" , autoClose: 2000} );
          setLoginForm({
            'email': '',
            'password': ''
          });

          navigate('/dashboard');

          
        }
      
    }else{
      toast.error("Veuillez remplir tous les champs" , {position: "top-center" , autoClose: 2000} )

    }
      
    } catch (error) {
      console.error(error);
      
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

