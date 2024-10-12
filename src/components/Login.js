import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Register from './Register'; // Import komponen Register

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // State untuk modal register
  const navigate = useNavigate();

  const Auth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Query untuk memverifikasi user berdasarkan username dan password
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) {
      setError('Login failed, please check your username or password');
      setIsLoading(false);
    } else {
      navigate("/dashboard");
      setIsLoading(false);
    }
  };

  return (
    <div className='flex bg-sky-100 h-screen w-full justify-center items-center'>
      <div className='w-1/4 bg-white rounded-md px-5 shadow py-10'>
        <div className='flex justify-center items-center'>
        <img 
              src="/lan.png" // Ganti dengan path gambar Anda
              alt="Icon Buku Tamu" // Deskripsi gambar
              className="w-12 h-12 ml-3" // Ukuran gambar dan margin kanan
      />
          <p className='text-3xl font-semibold text-blue-900 mx-2'>BukuTamu</p>
        </div>
        <form onSubmit={Auth} className='w-full py-10'>
          {error && <p className='w-full text-red-500 text-sm my-2'>{error}</p>}
          <div className='w-full'>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='block w-full rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 font-base focus:z-10 focus:border-2 focus:border-indigo-500 focus:outline-none sm:text-sm' 
              placeholder='Username'
              required
            />
          </div>

          <div className='w-full'>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='block w-full rounded-b-md border border-gray-300 px-3 py-2 mb-10 text-gray-900 font-base focus:z-10 focus:border-2 focus:border-indigo-500 focus:outline-none sm:text-sm' 
              placeholder='Password'
              required
            />
          </div>

          <button className='w-full bg-sky-500 px-3 py-2 rounded font-semibold text-white'>
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="flex justify-center mt-4">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setShowRegisterModal(true)} // Buka modal register
          >
            Register
          </button>
        </div>
      </div>

      {/* Modal untuk Register */}
      {showRegisterModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Register</h2>
            <Register closeModal={() => setShowRegisterModal(false)} /> {/* Komponen Register */}
            <button
              className="text-red-500 mt-4 hover:underline"
              onClick={() => setShowRegisterModal(false)} // Tutup modal register
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
