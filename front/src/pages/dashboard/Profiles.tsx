import { useEffect, useState } from 'react';
import ProfilePic from '../../assets/profile.png';
import { loadProfile, updateProfile } from '../../services/profileService';
import { toast, ToastContainer } from 'react-toastify';
import { DarkModeSwitch } from '../../components/ui/DarkModeSwitch';



const Profiles = () => {
    const [user, setUser] = useState<any>({});
    const token = useState<string>(localStorage.getItem("token")|| "");
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        email: user.email || "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setProfileData({...profileData, [e.target.name]: e.target.value})

    }

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

    const changeProfile = async() =>{
        try {
            if(profileData.email || profileData.password){
                const res = await updateProfile(token[0], profileData);
                if(res.status == 200){
                    setUser(res.data)
                    setIsEditing(false);
                    toast.success("Profile updated successfully")
                }

            }
            
        } catch (error: any) {
            
        }

        

    }

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
                    {isEditing ? (
                        <div className="space-y-4">
                        <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">Email Address:</span>
                            <input type='email' name='email' value={profileData.email} onChange={handleChange} placeholder={user.email} className="font-semibold" />
                        </div>

                        <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">New password :</span>
                            <input type='password' name='password' value={profileData.password} onChange={handleChange} placeholder="********" className="font-semibold" />
                        </div><br />
                        
                    </div>
                    ) : (
                        <div className="space-y-4">
                        <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">Email Address:</span>
                            <span className="font-semibold">{user.email}</span>
                        </div>

                        <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">Password:</span>
                            <span className="font-semibold">**********</span>
                        </div><br />
                    </div>
                    )}
                </section>
                <section>
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Features :</h3>

                    <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">Enable Dark Mode:</span>
                            <DarkModeSwitch />
                            
                        </div><br />

                    <div className="flex justify-center border-green-200 pb-2">
                            {isEditing ? (
                                <button onClick={()=>changeProfile()} className='ml-1 mr-1 bg-green-500 text-white
                             hover:bg-green-600 transition-colors px-4 py-2 rounded cursor-pointer'>Save change</button>
                            ) : (
                                <button onClick={()=>setIsEditing(!isEditing)} className='ml-1 mr-1 bg-green-500 text-white
                             hover:bg-green-600 transition-colors px-4 py-2 rounded cursor-pointer'>Modification</button>
                            )}
                        </div><br />
                </section>

            </div>
            <ToastContainer />
        </div>
    );
};

export default Profiles;

