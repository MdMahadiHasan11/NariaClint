import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import useAxiosPublic from '../hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';

export default function BreakingNewsList() {
    const [news, setNews] = useState([]);
    const [error, setError] = useState('');
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosPublic = useAxiosPublic();
    

    // Fetch news on component mount
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axiosPublic.get('/news');
                setNews(res.data);
            } catch (error) {
                console.error('Error fetching news:', error);
                setError('There was an error fetching the news.');
            }
        };
        fetchNews();
    }, [axiosPublic]);

    // Delete news item
    const handleDelete = async (id) => {
        try {
            const response = await axiosPublic.delete(`/news/${id}`);
            if (response.status === 200) {
                setNews(news.filter((item) => item._id !== id));
                Swal.fire({
                    title: 'Deleted!',
                    text: 'News deleted successfully.',
                    icon: 'success',
                });
            }
        } catch (error) {
            console.error('Error deleting the news:', error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an error deleting the news.',
                icon: 'error',
            });
        }
    };

    // Add new news
    const onSubmit = async (data) => {
        const { title, content } = data;
        const newNews = { title, content };

        try {
            const res = await axiosPublic.post('/news', newNews);
            reset();

            if (res.status === 201 && res.data.insertedId) {
                Swal.fire({
                    title: 'Success!',
                    text: 'News added successfully.',
                    timer: 2000,
                    icon: 'success',
                });
                setNews([...news, res.data]);  // Append new news to the list
            } else {
                Swal.fire({
                    title: 'Warning!',
                    text: 'The news was not added successfully.',
                    icon: 'warning',
                });
            }
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: 'There was an error while adding the news.',
                icon: 'error',
            });
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4 text-center mt-10 ">Offer Status</h2>
            {error && <p className="text-red-500">{error}</p>}

            {/* News table */}
            <div className="overflow-x-auto w-4/5 mx-auto">
                <table className="min-w-full bg-white table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">ID</th>
                            <th className="px-4 py-2">Title</th>
                            <th className="px-4 py-2">Content</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news.map((item) => (
                            <tr key={item._id}>
                                <td className="border px-4 py-2">{item._id}</td>
                                <td className="border px-4 py-2">{item.title}</td>
                                <td className="border px-4 py-2">{item.content}</td>
                                <td className="border px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="btn btn-error btn-sm text-white font-bold"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add New News Form */}
            <div className='flex justify-center items-center'> <p className='text-2xl font-bold my-10'>Add Offer Status</p></div>
            <div className='mx-auto  w-3/5 p-10 border-2'>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            className="input input-bordered w-full"
                            {...register("title", { required: "Title is required" })}
                        />
                        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                    </div>

                    <div>
                        <textarea
                            placeholder="Content"
                            className="input input-bordered w-full"
                            {...register("content", { required: "Content is required" })}
                        />
                        {errors.content && <p className="text-red-500">{errors.content.message}</p>}
                    </div>

                    <div>
                        <button className="btn btn-primary w-full">Add News</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
