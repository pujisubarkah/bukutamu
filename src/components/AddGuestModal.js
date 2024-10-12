import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure the Supabase client is correctly imported


const AddGuestModal = ({ visible, onClose }) => {
  const [nama, setNama] = useState('');
  const [asalInstansi, setAsalInstansi] = useState('');
  const [unit, setUnit] = useState('');
  const [noKontak, setNoKontak] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [keperluan, setKeperluan] = useState('');

  const [units, setUnits] = useState([]); // For storing unit options
  const [pegawai, setPegawai] = useState([]); // For storing pegawai options

  useEffect(() => {
    // Fetch units when the component mounts
    const fetchUnits = async () => {
      const { data, error } = await supabase
        .from('unit_kerja') // Replace with your actual units table name
        .select('*');

      if (error) {
        console.error('Error fetching units:', error);
      } else {
        setUnits(data);
      }
    };

    fetchUnits();
  }, []);

  // Fetch employees based on the selected unit
  const handleUnitChange = async (e) => {
    setUnit(e.target.value);
    
    const { data, error } = await supabase
      .from('pegawai') // Replace with your actual pegawai table name
      .select('*')
      .eq('unit_id', e.target.value);

    if (error) {
      console.error('Error fetching pegawai:', error);
    } else {
      setPegawai(data);
    }
  };
  

  const handleOnClose = (e) => {
    if (e.target.id === "background") onClose();
  };

  if (!visible) return null;

  const saveGuest = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('visitor') // Ganti dengan nama tabel yang sesuai
        .insert([
          {
            nama,
            asal_instansi: asalInstansi,
            unit_dituju: unit,
            no_kontak: noKontak,
            tuju_pegawai: tujuan,
            keperluan,
          },
        ]);

      if (error) {
        throw error; // Tangani error sesuai kebutuhan
      }

      console.log("Guest added successfully:", data); // Logging data yang berhasil ditambahkan

      onClose(); // Tutup modal setelah berhasil
      // Reset state setelah menambahkan tamu baru
      setNama('');
      setAsalInstansi('');
      setNoKontak('');
      setUnit('');
      setTujuan('');
      setKeperluan('');
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  return (
    <div onClick={handleOnClose} id='background' className='fixed inset-0 bg-slate-900 bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
      <div className='w-5/12 bg-white rounded shadow p-4'>
        <p className='text-xl font-bold text-sky-700'>Tambah Data Tamu</p>
        <br />
        <form onSubmit={saveGuest}>
          <div className='field py-3'>
            <label className='font-semibold text-slate-600'>Nama Pemohon</label>
            <input 
              type="text" 
              value={nama} 
              onChange={(e) => setNama(e.target.value)} 
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400' 
              required 
            />
          </div>

          <div className='field py-3'>
            <label className='font-semibold text-slate-600'>Asal/Instansi Pemohon</label>
            <input 
              type="text" 
              value={asalInstansi} 
              onChange={(e) => setAsalInstansi(e.target.value)} 
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400' 
              required 
            />
          </div>

          <div className='field py-3'>
            <label className='font-semibold text-slate-600'>No. Kontak Pemohon yang dapat dihubungi</label>
            <input 
              type="tel" // Ubah menjadi type="tel"
              value={noKontak} 
              onChange={(e) => setNoKontak(e.target.value)} 
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400' 
              required 
            />
          </div>

          <div className='field py-3'>
            <label className='font-semibold text-slate-600'>Unit Dituju</label>
            <select 
              value={unit} 
              onChange={handleUnitChange} 
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400' 
              required
            >
              <option value="">Pilih Unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.unit_name}</option>
              ))}
            </select>
          </div>


          {/* Pejabat/Pegawai Dituju */}
          <div className='field py-3'>
            <label className='font-semibold text-slate-600'>Pejabat/Pegawai Dituju</label>
            <select 
              value={tujuan} 
              onChange={(e) => setTujuan(e.target.value)} 
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400' 
              required
            >
              <option value="">Pilih Pegawai</option>
              {pegawai.map((p) => (
                <option key={p.id} value={p.id}>{p.pegawai_name}</option>
              ))}
            </select>
          </div>

          <div className='field py-3'>
            <label className='font-semibold text-slate-600'>Keperluan</label>
            <textarea 
              value={keperluan} 
              onChange={(e) => setKeperluan(e.target.value)} 
              cols="30"
              rows="10"
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400' 
              required 
            />
          </div>

          <button type='submit' className='py-1 px-3 bg-sky-600 rounded text-white shadow hover:bg-sky-500'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddGuestModal;
