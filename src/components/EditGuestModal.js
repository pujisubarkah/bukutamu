import React, { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const EditGuestModal = ({ onClose, visible, id }) => {
  const [nama, setNama] = useState('')
  const [asalInstansi, setAsalInstansi] = useState('')
  const [unitDituju, setUnitDituju] = useState('')
  const [noKontak, setNoKontak] = useState('')
  const [tujuan, settujuan] = useState('')
  const [keperluan, setKeperluan] = useState('')

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
          unit_dituju: unitDituju,
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
        setUnitDituju(data.unit_dituju)
        settujuan(data.tuju_pegawai)
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
      <div className='w-5/12 bg-white rounded shadow p-4'>
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
              type="tel" // Ubah menjadi type="tel"
              value={noKontak}
              onChange={(e) => setNoKontak(e.target.value)}
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400'
              required
            />
          </div>

          <div className='field py-3'>
            <label className='font-semibold text-slate-600'>Unit Dituju</label>
            <input
              type="text"
              value={unitDituju}
              onChange={(e) => setUnitDituju(e.target.value)}
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400'
              required
            />
          </div>

          <div className='field py-3'>
            <label className='font-semibold text-slate-600'>Pejabat/Pegawai Dituju</label>
            <input
              type="text"
              value={tujuan}
              onChange={(e) => settujuan(e.target.value)}
              className='block w-full bg-slate-100 py-1 px-3 rounded focus:outline-none focus:ring-1 focus:ring-sky-400 focus:border-sky-400'
              required
            />
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
  )
}

export default EditGuestModal
