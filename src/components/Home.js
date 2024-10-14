import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure the Supabase client is correctly imported
import AttendanceList from './AttendanceList'; // Impor komponen AttendanceList

const Home = () => {
  const [visitorsToday, setVisitorsToday] = useState(0);
  const [visitorsThisWeek, setVisitorsThisWeek] = useState(0);

  useEffect(() => {
    const fetchVisitorData = async () => {
      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of this week (Sunday)
      const startOfWeekISO = startOfWeek.toISOString();

      // Fetch today's visitors
      const { data: todayData, error: todayError } = await supabase
        .from('visitor')
        .select('*')
        .gte('created_at', startOfToday);

      // Fetch this week's visitors
      const { data: weekData, error: weekError } = await supabase
        .from('visitor')
        .select('*')
        .gte('created_at', startOfWeekISO);

      if (todayError) {
        console.error(todayError);
      } else {
        setVisitorsToday(todayData.length);
      }

      if (weekError) {
        console.error(weekError);
      } else {
        setVisitorsThisWeek(weekData.length);
      }
    };

    fetchVisitorData(); // Call the function inside useEffect
  }, []); // Dependency array is empty, so it only runs once after the component mounts

  return (
    <div className='w-full h-screen'>
      <section className='w-4/5 mx-auto'>
        <div className='pt-24'>
          <div className='flex gap-6'>
            <div className='w-1/3 shadow-md rounded-md p-4 bg-maroon'>
              <p className='text-xl font-semibold text-sky-800 py-3'>Pengunjung Hari Ini</p>
              <p className='text-3xl font-semibold text-sky-700 py-2'>{visitorsToday}</p>
            </div>

            <div className='w-1/3 shadow-md rounded-md p-4 bg-maroon'>
              <p className='text-xl font-semibold text-sky-800 py-3'>Pengunjung Minggu Ini</p>
              <p className='text-3xl font-semibold text-sky-700 py-2'>{visitorsThisWeek}</p>
            </div>
          </div>
          <div className="mt-10"> {/* Tambahkan margin top untuk pemisah */}
          <AttendanceList /> {/* Tambahkan komponen AttendanceList di sini */}>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
