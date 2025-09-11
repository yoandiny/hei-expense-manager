import ProfilePic from '../../assets/profile.png';

const Profiles = () => {
    return (
        <div className="min-h-screen p-8 bg-green-50 items-center align-middle">
            <div className="w-full mx-auto bg-white p-6 rounded-lg shadow-md">
                <section className="mb-8 items-center align-middle text-center">
                    <h2 className="text-2xl font-bold text-green-700 mb-4">Mon Profil</h2>
                    <img src={ProfilePic} alt="Profile picture" className='w-32 h-32 rounded-full mx-auto' />
                </section>

            </div>
        </div>
    );
};

export default Profiles;

