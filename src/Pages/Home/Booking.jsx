import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import useAxiosPublic from "../../Hooks/UseAxiosPublic";

export default function BookingForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const axiosPublic = useAxiosPublic();

  const onSubmit = async (data) => {
    const { name, contactNo, email, program, studyGap, englishTest, countryDestinations } = data;

    const BookingInfo = {
      name: name,
      contactNo: contactNo,
      email: email,
      program: program,
      studyGap: studyGap,
      englishTest: englishTest,
      countryDestinations: countryDestinations,
    };

    try {
      const res = await axiosPublic.post("/booking", BookingInfo);

      if (res.status === 201 && res.data.insertedId) {
        reset();
        Swal.fire({
          title: "Success!",
          text: "Booking submitted successfully.",
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Warning!",
          text: "The booking was not added successfully.",
          icon: "warning",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "There was an error while submitting the booking.",
        icon: "error",
      });
    }
  };

  return (
    <section id="booking" className="py-16 bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#2B3B5B] to-[#FF8C00] text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Booking Now
        </motion.h2>
        <motion.div
          className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-[#2B3B5B] to-[#1E2A40] p-6 md:p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Fill Your Details</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-[#2B3B5B] dark:text-gray-300 text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition duration-300 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Contact Number Field */}
              <div>
                <label htmlFor="contactNo" className="block text-[#2B3B5B] dark:text-gray-300 text-sm font-semibold mb-2">
                  Contact No.
                </label>
                <input
                  type="number"
                  id="contactNo"
                  placeholder="Enter your contact number"
                  className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition duration-300 ${
                    errors.contactNo ? "border-red-500" : ""
                  }`}
                  {...register("contactNo", { required: "Contact number is required" })}
                />
                {errors.contactNo && <p className="text-red-500 text-sm mt-1">{errors.contactNo.message}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[#2B3B5B] dark:text-gray-300 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition duration-300 ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Dropdown */}
              <div>
                <label htmlFor="program" className="block text-[#2B3B5B] dark:text-gray-300 text-sm font-semibold mb-2">
                  Program you are interested in
                </label>
                <select
                  id="program"
                  className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition duration-300 ${
                    errors.program ? "border-red-500" : ""
                  }`}
                  {...register("program", { required: "Program selection is required" })}
                >
                  <option value="">Select a program</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Masters">Masters</option>
                  <option value="PHD">PHD</option>
                  <option value="Other">Other</option>
                </select>
                {errors.program && <p className="text-red-500 text-sm mt-1">{errors.program.message}</p>}
              </div>

              {/* Study Gap Dropdown */}
              <div>
                <label htmlFor="studyGap" className="block text-[#2B3B5B] dark:text-gray-300 text-sm font-semibold mb-2">
                  Study Gap
                </label>
                <select
                  id="studyGap"
                  className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition duration-300 ${
                    errors.studyGap ? "border-red-500" : ""
                  }`}
                  {...register("studyGap", { required: "Study gap selection is required" })}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.studyGap && <p className="text-red-500 text-sm mt-1">{errors.studyGap.message}</p>}
              </div>
            </div>

            {/* English Test Field */}
            <div>
              <label htmlFor="englishTest" className="block text-[#2B3B5B] dark:text-gray-300 text-sm font-semibold mb-2">
                Any English Test (IELTS/PTE/EPT/TOEFL/GRE/GMAT/Duolingo)?
              </label>
              <input
                type="text"
                id="englishTest"
                placeholder="Enter your test"
                className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition duration-300"
                {...register("englishTest")}
              />
            </div>

            {/* Country Destinations Field */}
            <div>
              <label htmlFor="countryDestinations" className="block text-[#2B3B5B] dark:text-gray-300 text-sm font-semibold mb-2">
                Country Destinations
              </label>
              <input
                type="text"
                id="countryDestinations"
                placeholder="Enter country destinations"
                className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 dark:text-black dark:bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition duration-300 ${
                  errors.countryDestinations ? "border-red-500" : ""
                }`}
                {...register("countryDestinations", { required: "Country destinations are required" })}
              />
              {errors.countryDestinations && (
                <p className="text-red-500 text-sm mt-1">{errors.countryDestinations.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center pt-4">
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] hover:from-[#FF7C00] hover:to-[#FF5B00] text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
