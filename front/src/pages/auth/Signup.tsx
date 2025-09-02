import { useState } from 'react'
import Logo from '../../assets/logo.png'
import { Link } from 'react-router-dom';

const Signup = () => {
    const [signupForm, setSignupForm] = useState({
        'username': '',
        'email': '',
        'password': '',
        'confirmationPassword' :''
    });
  return (
    <div className="flex flex-col items-center mt-1">
        <img className='w-1/4 items-center' src={Logo} alt="" />
      <h1 className="text-4xl font-bold mb-10">Inscription</h1>
      <form className="flex flex-col w-1/2">
        <label htmlFor="name" className="mb-2">Nom d'utilisateur :</label>
        <input type="text" id="name" name="name" className="border-2 p-2 mb-4" /><br />
        <label htmlFor="email" className="mb-2">Email :</label>
        <input type="email" id="email" name="email" className="border-2 p-2 mb-4" /><br />
        <label htmlFor="password" className="mb-2">Mot de passe :</label>
        <input type="password" id="password" name="password" className="border-2 p-2 mb-4" /><br />
        <label htmlFor="repeatPassword" className='mb-2'>Répétez votre mot de passe :</label>
        <input type="password" id="repeatPassword" name="repeatPassword" className="border-2 p-2 mb-4" /><br />
        <p>Vous avez deja un compte ? <Link to="/login" className="text-blue-500">Connectez-vous</Link></p>
        <input type="submit" value="S'inscrire" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
      </form>
    </div>
  )
}

export default Signup

