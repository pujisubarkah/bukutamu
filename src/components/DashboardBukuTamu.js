import React, {useEffect} from 'react'
import Layout from '../layouts/Layout'
import IndexGuests from './IndexGuests' 
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../features/authSlice.js'

const DashboardBukuTamu = () => {
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
          <div className="mt-10"> {/* Tambahkan margin top untuk pemisah */}
          <IndexGuests/>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  )
}

export default DashboardBukuTamu