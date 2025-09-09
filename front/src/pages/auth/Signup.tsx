import { useState } from 'react'
import Logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify'
import axios from 'axios';

const Signup = () => {
  const navigate = useNavigate();
    const [signupForm, setSignupForm] = useState<{ email: string, password: string, confirmationPassword: string}>({
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


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      try {
        if( signupForm.email && signupForm.password && signupForm.confirmationPassword){
          if(signupForm.password === signupForm.confirmationPassword){
            const form = {
              "email": signupForm.email,
              "password": signupForm.password
            }
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, form);
            if(res.status === 200){
              toast.success("Inscription réussie" , {position: "top-center" , autoClose: 2000} );
              setSignupForm({
                'email': '',
                'password': '',
                'confirmationPassword' :''
              });
              navigate('/login');

            }else{
              throw new Error("Erreur lors de l'inscription");
            }

          }else{
            toast.error("Les mots de passe ne correspondent pas" , {position: "top-center" , autoClose: 2000} )
          }
        
      } else {
        
        toast.error("Veuillez remplir tous les champs" , {position: "top-center" , autoClose: 2000} )
      }
        
      } catch (error) {
        console.error(error);
        toast.error("Une erreur est survenue" , {position: "top-center" , autoClose: 2000} )
        
      }
    }
  return (
    <div className="flex flex-col items-center mt-1">
        <img className='w-1/7 items-center' src={Logo} alt="" />
      <h1 className="text-4xl font-bold mb-10">Inscription</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-1/2 items-center shadow-2xl rounded-2xl">
        <label htmlFor="email" className="mb-2">Email :</label>
        <input type="email" id="email" onChange={handleChange} name="email" className="border-2 p-2 mb-4 w-100 " /><br />
        <label htmlFor="password" className="mb-2">Mot de passe :</label>
        <input type="password" id="password" onChange={handleChange} name="password" className="border-2 p-2 mb-4 w-100" /><br />
        <label htmlFor="repeatPassword" className='mb-2'>Répétez votre mot de passe :</label>
        <input type="password" id="repeatPassword" onChange={handleChange} name="confirmationPassword" className="w-100 border-2 p-2 mb-4" /><br />
        <p>Vous avez deja un compte ? <Link to="/login" className="text-blue-500">Connectez-vous</Link></p>
        <input type="submit" value="S'inscrire"  className=" mb-1 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
      </form>
      <ToastContainer />
    </div>
  )
}

export default Signup

