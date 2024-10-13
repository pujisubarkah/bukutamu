import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const EditGuestModal = ({ onClose, visible, id }) => {
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
  const handleUnitChange = async (unitId) => {
    setUnit(unitId);

    const { data, error } = await supabase
      .from('pegawai') // Replace with your actual pegawai table name
      .select('*')
      .eq('unit_id', unitId);

    if (error) {
      console.error('Error fetching pegawai:', error);
    } else {
      setPegawai(data);
    }
  };
  

  const handleOnClose = (e) => {
    if (e.target.id === "background") onClose()
  }

  useEffect(() => {
    if (visible) {
      getGuestById(id)
    }
  }, [visible])

  const updateGuest = async (e) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('visitor')  // Your table name in Supabase
        .update({
          nama,
          asal_instansi: asalInstansi,
          no_kontak: noKontak,
          unit_dituju: unit,
          tuju_pegawai: tujuan,
          keperluan
        })
        .eq('id', id) // Assuming 'id' is the primary key

      if (error) {
        console.error('Error updating guest:', error)
      } else {
        console.log('Guest updated successfully:', data)
        onClose()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getGuestById = async (id) => {
    try {
      const { data, error } = await supabase
        .from('visitor')  // Your table name in Supabase
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching guest:', error)
      } else {
        setNama(data.nama)
        setAsalInstansi(data.asal_instansi)
        setUnit(data.unit_dituju)
        handleUnitChange(data.unit_dituju)
        setTujuan(data.tuju_pegawai)
        setNoKontak(data.no_kontak)
        setKeperluan(data.keperluan)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (!visible) return null

  return (
    <div onClick={handleOnClose} id="background" className='fixed inset-0 bg-slate-900 bg-opacity-30 backdrop-blur-sm flex justify-center items-center'>
      <div className='w-5/12 bg-white rounded shadow p-4 max-h-[60vh] overflow-y-auto'>
        <p className='text-xl font-bold text-sky-700'>Edit Data Tamu</p>
        <br />
        <form onSubmit={updateGuest}>
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
            <label className='font-semibold text-slate-600'>No. Kontak Pemohon yang Dapat dihubungi</label>
            <input  
              type="tel"
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
              onChange={(e) => handleUnitChange(e.target.value)} 
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400' 
              required
            >
              <option value="">Pilih Unit</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.unit_name}</option>
              ))}
            </select>
          </div>

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
              rows="4"
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400'
              required
            />
          </div>

          <button type='submit' className='py-1 px-3 bg-sky-600 rounded text-white shadow hover:bg-sky-500'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default EditGuestModal
