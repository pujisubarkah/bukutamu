import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';  // Ensure the Supabase client is imported correctly
import BarChart from './Barchart';  // Pastikan menggunakan huruf besar


const Home = () => {
  const [visitorsToday, setVisitorsToday] = useState(0);
  const [visitorsThisWeek, setVisitorsThisWeek] = useState(0);
  const [visitorsThisMonth, setVisitorsThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorData = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfWeekISO = startOfWeek.toISOString();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

        const { data: todayData, error: todayError } = await supabase
          .from('visitor')
          .select('*')
          .gte('created_at', startOfToday);

        const { data: weekData, error: weekError } = await supabase
          .from('visitor')
          .select('*')
          .gte('created_at', startOfWeekISO);

        const { data: monthData, error: monthError } = await supabase
          .from('visitor')
          .select('*')
          .gte('created_at', startOfMonth);

        if (todayError) throw todayError;
        if (weekError) throw weekError;
        if (monthError) throw monthError;

        setVisitorsToday(todayData.length);
        setVisitorsThisWeek(weekData.length);
        setVisitorsThisMonth(monthData.length);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, []);  // Empty dependency array ensures this runs only once on mount

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-screen">
      <section className="w-4/5 mx-auto">
        <div className="pt-24">
          <div className="flex gap-6">
            <div className="w-1/3 shadow-md rounded-md p-4 bg-maroon">
              <p className="text-xl font-semibold text-sky-800 py-3">Pengunjung Hari Ini</p>
              <p className="text-3xl font-semibold text-sky-700 py-2">{visitorsToday}</p>
            </div>

            <div className="w-1/3 shadow-md rounded-md p-4 bg-maroon">
              <p className="text-xl font-semibold text-sky-800 py-3">Pengunjung Minggu Ini</p>
              <p className="text-3xl font-semibold text-sky-700 py-2">{visitorsThisWeek}</p>
            </div>

            <div className="w-1/3 shadow-md rounded-md p-4 bg-maroon">
              <p className="text-xl font-semibold text-sky-800 py-3">Pengunjung Bulan Ini</p>
              <p className="text-3xl font-semibold text-sky-700 py-2">{visitorsThisMonth}</p>
            </div>
          </div>
        </div>
        <BarChart />
        </section>
    </div>
  
  );
};

export default Home;
