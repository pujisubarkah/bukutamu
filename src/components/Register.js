import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Register = ({ closeModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Insert data user ke tabel 'users' di Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password }]);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Jika berhasil, tutup modal dan redirect ke login
      closeModal();
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister}>
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
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='block w-full border border-gray-300 px-3 py-2 text-gray-900 font-base focus:z-10 focus:border-2 focus:border-indigo-500 focus:outline-none sm:text-sm' 
          placeholder='Email'
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
        {isLoading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default Register;
