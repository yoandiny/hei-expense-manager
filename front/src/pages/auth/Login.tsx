import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/logo.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log({ email, password })
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-2 p-2 mb-4 w-full"
        />
        <br />
        <input
          type="submit"
          value="Se connecter"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        />
      </form>
      <p className="mt-4">
        Pas encore de compte ? <Link to="/signup" className="text-blue-500">Inscrivez-vous</Link>
      </p>
    </div>
  )
}

