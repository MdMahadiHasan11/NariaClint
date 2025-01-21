import  { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

export default function CardList() {
    const [cards, setCards] = useState([]);
    const [error, setError] = useState("");

    const apiBaseUrl = "http://localhost:5000"; // Replace with your backend URL
    const imgbbApiKey = "5c49c7e28a6807775bcd1899796bdc4b";

    // Fetch cards on component mount
    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await axios.get(`${apiBaseUrl}/card`);
                setCards(res.data);
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Failed to load cards. Please try again later.");
            }
        };
        fetchCards();
    }, []);

    // Handle card deletion
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${apiBaseUrl}/card/${id}`);
            if (res.status === 200) {
                setCards((prevCards) => prevCards.filter((card) => card._id !== id));
                Swal.fire("Deleted!", "The card has been successfully deleted.", "success");
            }
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
            Swal.fire("Error", "Failed to delete the card.", "error");
        }
    };

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Handle new card submission
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("image", data.image[0]); // Append the image file directly

        try {
            // Upload the image to ImgBB
            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
                formData
            );

            if (imgRes.data.success) {
                // Prepare the card data for the backend
                const newCard = {
                    title: data.title,
                    header: data.header,
                    subHeader: data.subHeader,
                    description: data.description, // Add description field
                    imageUrl: imgRes.data.data.display_url, // URL from ImgBB
                };
                console.log('image upload');
                console.log(newCard);

                // Send the card data to your backend
                const res = await axios.post(`${apiBaseUrl}/card`, newCard);
                if (res.status === 201) {
                    Swal.fire("Success!", "Card added successfully.", "success");
                    reset();
                    setCards((prev) => [...prev, res.data]);
                }
            }
        } catch (err) {
            Swal.fire("Error!", `Failed to add the card: ${err.message}`, "error");
        }
    };

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-3xl text-center mt-10 font-semibold mb-6">Card List</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Image</th>
                            <th className="px-4 py-2 text-left">Title</th>
                            <th className="px-4 py-2 text-left">Header</th>
                            <th className="px-4 py-2 text-left">Sub Header</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card) => (
                            <tr key={card._id} className="border-t border-gray-300">
                                <td className="px-4 py-2">
                                    <img
                                        src={card.imageUrl || "/default-image.png"}
                                        alt={card.title || "Card image"}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                </td>
                                <td className="px-4 py-2">{card.title}</td>
                                <td className="px-4 py-2">{card.header}</td>
                                <td className="px-4 py-2">{card.subHeader}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(card._id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="my-10 p-10">
                <p className="text-3xl font-bold text-center">Add Card</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid border-2 p-10 gap-4 mt-6">
                <input
                    type="text"
                    placeholder="Title"
                    className="input input-bordered w-full"
                    {...register("title", { required: "Title is required" })}
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                <input
                    type="text"
                    placeholder="Header"
                    className="input input-bordered w-full"
                    {...register("header", { required: "Header is required" })}
                />
                {errors.header && <p className="text-red-500">{errors.header.message}</p>}

                <input
                    type="text"
                    placeholder="Sub Header"
                    className="input input-bordered w-full"
                    {...register("subHeader", { required: "Sub Header is required" })}
                />
                {errors.subHeader && <p className="text-red-500">{errors.subHeader.message}</p>}

                <textarea
                    placeholder="Description"
                    className="textarea textarea-bordered w-full"
                    {...register("description", { required: "Description is required" })}
                />
                {errors.description && <p className="text-red-500">{errors.description.message}</p>}

                <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    {...register("image", { required: "Image is required" })}
                />
                {errors.image && <p className="text-red-500">{errors.image.message}</p>}

                <button type="submit" className="btn btn-primary w-full">
                    Add Card
                </button>
            </form>
        </div>
    );
}
