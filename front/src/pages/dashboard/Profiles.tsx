import { useEffect, useState } from 'react';
import ProfilePic from '../../assets/profile.png';
import { loadProfile } from '../../services/profileService';
import { toast, ToastContainer } from 'react-toastify';



const Profiles = () => {
    const [user, setUser] = useState<any>({});
    const token = useState<string>(localStorage.getItem("token")|| "");
    const [isEditing, setIsEditing] = useState(false);

    const getProfile = async() =>{
        try {
            if(token){
            const res = await loadProfile(token[0]);
            if(res.status == 200){
                setUser(res.data)
                
                
            }
        }
        } catch (error: any) {
            toast.error(error.response?.data?.message)
            
        }
    }

    const changeProfile = () =>{}

useEffect(()=>{
    getProfile();
})
    return (
        <div className="min-h-screen p-8 bg-green-50 items-center align-middle">
            <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
                <section className="mb-8 items-center align-middle text-center">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">My Profile</h2>
                    <img src={ProfilePic} alt="Profile picture" className='w-32 h-32 rounded-full mx-auto' />
                </section>
                <section>
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Personal Information :</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">Email Address:</span>
                            <span className="font-semibold">{user.email}</span>
                        </div>

                        <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">Password:</span>
                            <span className="font-semibold">**********</span>
                        </div>
                        
                    </div>
                </section>
                <section>
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Features :</h3>

                    <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">Enable Dark Mode:</span>
                            
                        </div>

                    <div className="flex justify-center border-b border-green-200 pb-2">
                            <button className='ml-1 mr-1 bg-green-500 text-white
                             hover:bg-green-600 transition-colors px-4 py-2 rounded cursor-pointer'>Modification</button>
                            <button className='ml-1 mr-1 bg-red-500
                             hover:bg-red-600 transition-colors text-white px-4 py-2 rounded cursor-pointer'>Delete the account</button>
                        </div>
                </section>

            </div>
            <ToastContainer />
        </div>
    );
};

export default Profiles;

