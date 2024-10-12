import React, { useEffect, useState } from "react";
import { supabase } from '../supabaseClient';
import moment from "moment";
import ReactPaginate from "react-paginate";
import AddGuestModal from "./AddGuestModal"; // Ensure this path is correct
import EditGuestModal from "./EditGuestModal";
import * as XLSX from 'xlsx'; // Import the XLSX library
import { FaFileExcel } from 'react-icons/fa';  // Import the Excel icon


const IndexGuests = () => {
    const [guests, setGuests] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [totalPage, setTotalPage] = useState(0);
    const [totalRow, setTotalRow] = useState(0);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [modalId, setModalId] = useState("");

    useEffect(() => {
        getGuests();
    }, [page, search, showModalAdd, showModalEdit]);

    const getGuests = async () => {
        try {
            const { data, error, count } = await supabase
                .from('visitor')
                .select(`
                    *,
                    unit_dituju:unit_dituju (unit_name),
                    tuju_pegawai:tuju_pegawai (pegawai_name)
                `, { count: 'exact' })
                .ilike('nama', `%${search}%`)
                .range(page * limit, (page + 1) * limit - 1); // Adjusted range for pagination

            if (error) throw error;

            setGuests(data);
            setTotalRow(count);
            setTotalPage(Math.ceil(count / limit));
        } catch (error) {
            console.error('Error fetching guests:', error.message);
        }
    };

    const searchData = (e) => {
        e.preventDefault();
        setPage(0);
        getGuests(); // Fetch guests when searching
    };

    const changePage = ({ selected }) => {
        setPage(selected);
        if (selected === 9) {
            setMessage("Jika belum menemukan data yang dicari, Silahkan cari lewat kolom pencarian dengan keyword lebih spesifik!");
        } else {
            setMessage("");
        }
    };

    const deleteGuest = async (id) => {
        try {
            const { error } = await supabase
                .from('visitor')
                .delete()
                .eq('id', id);

            if (error) throw error;

            getGuests(); // Refresh guests after deletion
        } catch (error) {
            console.error('Error deleting guest:', error.message);
        }
    };

    const handleAddGuest = async (newGuest) => {
        try {
            const { error } = await supabase
                .from('visitor')
                .insert(newGuest);

            if (error) throw error;

            setShowModalAdd(false); // Close modal after adding
            getGuests(); // Refresh guests list
        } catch (error) {
            console.error('Error adding guest:', error.message);
        }
    };

    const handleEditGuest = async (updatedGuest) => {
        try {
            const { error } = await supabase
                .from('visitor')
                .update(updatedGuest)
                .eq('id', modalId);

            if (error) throw error;

            setShowModalEdit(false); // Close modal after editing
            getGuests(); // Refresh guests list
        } catch (error) {
            console.error('Error editing guest:', error.message);
        }
    };

// Define the exportToExcel function
const exportToExcel = () => {
    // Prepare data to export (make sure your data is structured properly)
    const worksheetData = guests.map(guest => ({
        'ID': guest.id,
        'Tanggal': moment(guest.created_at).format('DD MMMM YYYY'),
        'Nama': guest.nama,
        'No. Telepon': guest.no_kontak,
        'Unit Dituju': guest.unit_dituju,
        'Pejabat/Pegawai': guest.tuju_pegawai,
        'Keperluan': guest.keperluan
    }));

    // Create a new worksheet
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guests');

    // Export the Excel file
    XLSX.writeFile(workbook, 'Guests_List.xlsx');
};

    return (
        <div>
            <div className="w-full mt-24">
                <div className="flex justify-between w-11/12 mx-auto ">
                    <div className="w-1/3">
                        <button onClick={() => setShowModalAdd(true)} className="py-2 px-3 font-medium text-white bg-green-500 rounded shadow hover:bg-green-400">Tambah Tamu</button>
                    </div>
                    <div className="w-1/3 mt-1 flex rounded-md shadow-sm">
                        <form onSubmit={searchData} className="w-full">
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-3 py-2 border rounded-none rounded-l-md border-gray-300 focus:outline-none focus:ring-primary focus:ring-1 focus:border-indigo-400 sm:text-sm" 
                                placeholder="Cari data..."
                            />
                        </form>
                        
                        <button className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-sky-700 hover:bg-sky-600 px-4 text-sm text-white">    
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="w-full flex justify-center mt-16">
                    <table className="border-collapse table-auto w-11/12 text-sm self-center">
                        <thead>
                            <tr>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">#</th>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Tanggal</th>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Nama</th>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Asal/Instansi</th>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">No.Telepon</th>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Unit Dituju</th>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Pejabat/Pegawai</th>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Keperluan</th>
                                <th className="border-b text-base dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800">
    {guests.map((visitor, index) => ( // Change `guest` to `visitor`
        <tr key={visitor.id}>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">{visitor.id}</td>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{moment(visitor.created_at).format('DD MMMM YYYY')}</td>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{visitor.nama}</td>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{visitor.asal_instansi}</td>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{visitor.no_kontak}</td>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{visitor.unit_dituju.unit_name}</td>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400">{visitor.tuju_pegawai.pegawai_name}</td>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">{visitor.keperluan}</td>
            <td className="border-b text-base border-slate-100 dark:border-slate-700 p-4 pr-8 text-slate-500 dark:text-slate-400">
                <button 
                    onClick={() => {
                        setShowModalEdit(true);
                        setModalId(visitor.id); // Change `guest` to `visitor`
                }} 
                className="bg-yellow-400 p-1 rounded hover:bg-yellow-300 mr-2"
            >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white " className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.185 3.185l-1.662 1.663m-1.79 1.79l-1.662 1.663-4.09-4.09 1.662-1.663M4.5 17.25V19.5h2.25l8.553-8.553-2.25-2.25L4.5 17.25z" />
                    </svg>
                </button>
                <button 
                    onClick={() => deleteGuest(visitor.id)} // Change `guest` to `visitor`
                    className="bg-red-500 p-1 rounded hover:bg-red-400"
                                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            {/* Export to Excel Button */}
            <div className="flex justify-end w-11/12 mx-auto mt-4"><button 
            onClick={exportToExcel} 
            className="py-2 px-3 font-medium text-white bg-blue-500 rounded shadow hover:bg-blue-400 flex items-center">
                <FaFileExcel className="mr-2" /> {/* This renders the Excel icon */}
                {/* You can remove the text if you just want the icon */}
                </button>
                </div>

            <div className="flex justify-center my-5">
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel="Next >"
                        onPageChange={changePage}
                        pageRangeDisplayed={2}
                        pageCount={totalPage}
                        previousLabel="< Previous"
                        renderOnZeroPageCount={null}
                        containerClassName="pagination"
                        activeClassName="active"
                    />
                </div>
                {message && (
                    <div className="text-red-500 text-center">
                        {message}
                    </div>
                )}
            </div>

            {/* Add Guest Modal */}
            {showModalAdd && (
                <AddGuestModal
                    onClose={() => setShowModalAdd(false)}
                    onAddGuest={handleAddGuest}
                    visible={true}
                />
            )}

            {/* Edit Guest Modal */}
            {showModalEdit && (
                <EditGuestModal
                    id={modalId}
                    onClose={() => setShowModalEdit(false)}
                    onEditGuest={handleEditGuest}
                    visible={true}
                />
            )}
        </div>
    );
};

export default IndexGuests; 
