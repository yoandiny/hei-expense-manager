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
        <div className="min-h-screen p-8 bg-green-50 flex justify-center items-start">
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
                <section className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-green-700 mb-4">My Profile</h2>
                    <img src={ProfilePic} alt="Profile picture" className="w-32 h-32 rounded-full mx-auto border-4 border-green-200 shadow"/>
                </section>
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Personal Information</h3>
                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="flex flex-col">
                                <label className="text-gray-600 mb-1">Email Address</label>
                                <input type="email" name="email" value={profileData.email} onChange={handleChange} placeholder={user.email} className="border border-green-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"/>
                            </div>

                            <div className="flex flex-col">
                                <label className="text-gray-600 mb-1">New Password</label>
                                <input type="password" name="password" value={profileData.password} onChange={handleChange} placeholder="********" className="border border-green-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"/>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-green-200 pb-3">
                                <span className="text-gray-600">Email Address</span>
                                <span className="font-semibold">{user.email}</span>
                            </div>

                            <div className="flex justify-between border-b border-green-200 pb-3">
                                <span className="text-gray-600">Password</span>
                                <span className="font-semibold">**********</span>
                            </div>
                        </div>
                    )}
                </section>
                <section className="mb-8">
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Features</h3>

                    <div className="flex justify-between border-b border-green-200 pb-2">
                            <span className="text-gray-600">Enable Dark Mode:</span>
                            <DarkModeSwitch />
                            
                        </div><br />
                </section>

                <div className="flex justify-center gap-4">
                    {isEditing ? (
                        <button
                            onClick={() => changeProfile()}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
                        >
                            Save Changes
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600 transition"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <ToastContainer />
        </div>
    );

};

export default Profiles;

