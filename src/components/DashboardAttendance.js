import React, {useEffect} from 'react'
import Layout from '../layouts/Layout.js'
import AttendanceList from './AttendanceList.js' 
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../features/authSlice.js'

const DashboardAttendance = () => {
  const dispatch = useDispatch()
  const navigate =  useNavigate()
  const {isError} = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])

  useEffect(() => {
    if(isError) navigate('/')
  }, [isError, navigate])
  
  return (
    <Layout>
    <div className='w-full h-screen'>
      <section className='w-4/5 mx-auto'>
        <div className='pt-24'>
          <div className='flex gap-6'>
            <div className='w-1/3 shadow-md rounded-md p-4 bg-maroon'>
              <p className='text-xl font-semibold text-sky-800 py-3'>Pegawai Hadir Hari Ini</p>
              <p className='text-3xl font-semibold text-sky-700 py-2'>xxx</p>
            </div>
          </div>
          <div className="mt-10"> {/* Tambahkan margin top untuk pemisah */}
          <AttendanceList/>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  )
}

export default DashboardAttendance