/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
// import useAxiosPublic from '../hooks/useAxiosPublic';

export default function VideoLinkList() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(''); // Declare the error state
  const axiosPublic = useAxiosPublic(); // Call the custom hook here and reuse it

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch video links
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosPublic.get('/video'); // Make GET request to fetch videos
        setVideos(res.data); // Update the videos state with the fetched data
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('There was an error fetching the video links.');
      }
    };

    fetchVideos();
  }, [axiosPublic]); // Dependency array includes `axiosPublic`

  const handleDelete = async (id) => {
    try {
      const response = await axiosPublic.delete(`/video/${id}`); // DELETE request

      if (response.status === 200) {
        setVideos(videos.filter((video) => video._id !== id)); // Update state to remove the deleted video
        Swal.fire('Deleted!', 'The video link has been deleted.', 'success');
      } else {
        Swal.fire('Failed!', 'Failed to delete the video link.', 'error');
      }
    } catch (err) {
      console.error('Error deleting the video:', err);
      Swal.fire('Error!', 'There was an error deleting the video.', 'error');
    }
  };

  const onSubmit = async (data) => {
    const { title, url } = data;

    const VideoInfo = {
      title: title,
      url: url,
    };

    try {
      const res = await axiosPublic.post('/video', VideoInfo);
      if (res.status === 201 && res.data.insertedId) {
        setVideos([...videos, { _id: res.data.insertedId, title, url }]); // Update the state with the new video
        reset();

        Swal.fire({
          title: 'Success!',
          text: 'Video added successfully.',
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: 'Warning!',
          text: 'The video was not added successfully.',
          icon: 'warning',
        });
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'There was an error while adding the video.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center mt-10 ">Video Link List</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto w-3/5 mx-auto border p-10 mt-10">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video._id}>
                <td>{video._id}</td>
                <td>{video.title}</td>
                <td>
                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {video.url}
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(video._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p className='text-center text-3xl font-bold my-10'>Add Link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 w-3/4 mx-auto my-10 p-10 border-2 space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="input input-bordered w-full"
          {...register('title', { required: true })}
        />
        {errors.title && <p className="text-red-500">Title is required.</p>}

        <input
          type="url"
          placeholder="Video URL"
          className="input input-bordered w-full"
          {...register('url', { required: true })}
        />
        {errors.url && <p className="text-red-500">Video URL is required.</p>}

        <button type="submit" className="btn btn-primary w-full">
          Add Video Link
        </button>
      </form>
    </div>
  );
}
