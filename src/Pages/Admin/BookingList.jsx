import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';

export default function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setIsLoading(true);
                const res = await axiosPublic.get('/booking');
                setBookings(res.data);
                setError('');
            } catch (error) {
                console.error('Error fetching Bookings:', error);
                setError('There was an error fetching the Bookings. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [axiosPublic]);

    const handleDelete = async (id) => {
        try {
            await axiosPublic.delete(`/booking/${id}`);
            setBookings(bookings.filter((booking) => booking._id !== id));  // Remove the deleted booking from the list
        } catch (error) {
            console.error('Error deleting booking:', error);
            setError('There was an error deleting the booking. Please try again later.');
        }
    };

    const downloadPDF = (booking) => {
        const doc = new jsPDF();

        // Add content to the PDF
        doc.text('Booking Details', 20, 10);
        doc.text(`Name: ${booking.name}`, 20, 20);
        doc.text(`Email: ${booking.email}`, 20, 30);
        doc.text(`Contact No.: ${booking.contactNo}`, 20, 40);
        doc.text(`Program: ${booking.program}`, 20, 50);  {/* Fixed the incorrect label */}
        doc.text(`Study Gap: ${booking.studyGap}`, 20, 60);
        doc.text(`English Test: ${booking.englishTest}`, 20, 70);

        doc.text(`Country Destinations: ${booking.countryDestinations}`, 20, 80);

        // Download the PDF
        doc.save(`${booking.name}_Booking.pdf`);
    };

    return (
        <section className="py-16 bg-gradient-to-b from-white to-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-[#2B3B5B]">Bookings</h2>

                {isLoading ? (
                    <div className="text-center text-lg">Loading...</div>
                ) : error ? (
                    <div className="text-center text-lg text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Contact No.</th>
                                    <th className="px-4 py-2 text-left">Country Destinations</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking._id}>
                                        <td className="border px-4 py-2">{booking.name}</td>
                                        <td className="border px-4 py-2">{booking.email}</td>
                                        <td className="border px-4 py-2">{booking.contactNo}</td>
                                        <td className="border px-4 py-2">{booking.countryDestinations}</td>
                                        <td className="border px-4 py-2 flex space-x-2 justify-center">
                                            <button
                                                onClick={() => handleDelete(booking._id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => downloadPDF(booking)}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                            >
                                                Download PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
