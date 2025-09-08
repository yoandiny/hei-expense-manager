import { useState } from 'react'
import Logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify'

const Signup = () => {
    const [signupForm, setSignupForm] = useState<{username: string, email: string, password: string, confirmationPassword: string}>({
        'username': "",
        'email': '',
        'password': '',
        'confirmationPassword' :''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setSignupForm(prev => ({
    ...prev,
    [name]: value
  }));
};


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if(signupForm.username && signupForm.email && signupForm.password && signupForm.confirmationPassword){
        console.log(signupForm)
      } else {
        
        toast.error("Veuillez remplir tous les champs" , {position: "top-center" , autoClose: 2000} )
      }
    }
  return (
    <div className="flex flex-col items-center mt-1">
        <img className='w-1/4 items-center' src={Logo} alt="" />
      <h1 className="text-4xl font-bold mb-10">Inscription</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-1/2">
        <label htmlFor="name" className="mb-2">Nom d'utilisateur :</label>
        <input type="text" id="name" onChange={handleChange} name="username" className="border-2 p-2 mb-4" /><br />
        <label htmlFor="email" className="mb-2">Email :</label>
        <input type="email" id="email" onChange={handleChange} name="email" className="border-2 p-2 mb-4" /><br />
        <label htmlFor="password" className="mb-2">Mot de passe :</label>
        <input type="password" id="password" onChange={handleChange} name="password" className="border-2 p-2 mb-4" /><br />
        <label htmlFor="repeatPassword" className='mb-2'>Répétez votre mot de passe :</label>
        <input type="password" id="repeatPassword" onChange={handleChange} name="confirmationPassword" className="border-2 p-2 mb-4" /><br />
        <p>Vous avez deja un compte ? <Link to="/login" className="text-blue-500">Connectez-vous</Link></p>
        <input type="submit" value="S'inscrire"  className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
      </form>
      <ToastContainer />
    </div>
  )
}

export default Signup

