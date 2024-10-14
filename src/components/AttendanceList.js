import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan Supabase client sudah diimport dengan benar

const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Menampilkan 10 data per halaman

  // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  //Fetch data from API and filter by nama from Supabase pegawai table
  useEffect(() => {
    const fetchAndFilterAttendanceData = async () => {
      const today = getTodayDate();
      const apiUrl = `https://intranet.lan.go.id:8446/laporanharian/sitkp/${today}/${today}`;

      try {
        // Step 1: Fetch all pegawai_name from Supabase
        const { data: supabaseNames, error: supabaseError } = await supabase
          .from('pegawai') // Mengambil data dari tabel pegawai
          .select('pegawai_name');

        if (supabaseError) {
          throw new Error(`Error fetching data from Supabase: ${supabaseError.message}`);
        }

        const namesFromSupabase = supabaseNames.map(item => item.pegawai_name); // Array of pegawai_name

        // Step 2: Fetch data from API
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const apiData = await response.json();

        // Step 3: Filter API data by nama from Supabase
        const filteredData = apiData.filter(person => namesFromSupabase.includes(person.nama));

      // Step 4: Sort the filtered data by absen_masuk (most recent first)
      const sortedData = filteredData.sort((a, b) => 
        new Date(b.absenMasukSitkp) - new Date(a.absenMasukSitkp)
      );

      // Set the sorted data to display on the frontend
      setAttendanceData(sortedData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching or filtering attendance data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

    fetchAndFilterAttendanceData(); // Call the function inside useEffect
  }, []);

 
  // Loading state
  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Filter data based on search term
  const filteredData = attendanceData.filter(person =>
    person.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logic for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Function to go to the next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  // Function to go to the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Display table
  return (
    <div>
     <h2 style={{ fontSize: '2rem', color: 'blue' }}>Kehadiran Pegawai LAN Hari Ini</h2>
      <input 
        type="text" 
        placeholder="Cari nama..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
      />
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Foto</th>
            <th>Jam Absen Masuk</th>
            <th>Jam Absen Pulang</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((person, index) => {
              const absenMasuk = new Date(person.absenMasukSitkp);
              const absenPulang = new Date(person.absenPulangSitkp);

              return (
                <tr key={person.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{person.nama}</td>
                  <td>
                    <img 
                      src={`http://idaman.lan.go.id/uploads/${person.nip}.jpg`} 
                      alt={`Foto ${person.nama}`} 
                      style={{ width: '50px', height: '50px', borderRadius: '50%' }} 
                    />
                  </td>
                  <td>{absenMasuk.toLocaleTimeString('id-ID')}</td> {/* Jam Absen Masuk */}
                  <td>{absenPulang.toLocaleTimeString('id-ID')}</td> {/* Jam Absen Pulang */}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">Data tidak ditemukan</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          style={{
            marginRight: '10px',
            padding: '5px 10px',
            backgroundColor: currentPage === 1 ? 'gray' : 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Previous
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          style={{
            padding: '5px 10px',
            backgroundColor: currentPage === totalPages ? 'gray' : 'red',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AttendanceList;
