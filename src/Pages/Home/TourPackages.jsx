import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';

export default function TourPackages() {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const swiperRef = useRef(null); // Ref to access Swiper instance

  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await axiosPublic.get('/card');
        setPackages(res.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, [axiosPublic]);

  useEffect(() => {
    if (selectedPackage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPackage]);

  // eslint-disable-next-line no-unused-vars
  const handleBookNow = () => {
    setSelectedPackage(null);
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler for the left arrow button click
  const handlePrevSlide = () => {
    swiperRef.current.swiper.slidePrev(); // Swiper API to go to the previous slide
  };

  // Handler for the right arrow button click
  const handleNextSlide = () => {
    swiperRef.current.swiper.slideNext(); // Swiper API to go to the next slide
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#2B3B5B] to-[#FF8C00] text-transparent bg-clip-text">
            Study in Your Dream Country 
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-[#2B3B5B] to-[#FF8C00] mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative px-12">
          <Swiper
            ref={swiperRef} // Attach swiperRef to the Swiper component
            spaceBetween={20}
            slidesPerView={1}
            centeredSlides={true}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1280: {
                slidesPerView: 3, // Default 3 slides for lg devices
              },
            }}
          >
            {packages.map((pkg) => (
              <SwiperSlide key={pkg._id}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end justify-start p-4">
                      <motion.button
                        className="bg-[#FF8C00] hover:bg-[#FF6B00] text-white font-bold py-2 px-4 rounded transition duration-300 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1 text-[#2B3B5B]">{pkg.title}</h3>
                    <p className="text-sm text-[#FF8C00] font-semibold">{pkg.header}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 z-10 transition duration-300"
            onClick={handlePrevSlide} // Use the handler for the left arrow button
            style={{ left: '0', zIndex: 10 }}
          >
            <ChevronLeft className="w-6 h-6 mx-auto" />
          </button>
          <button
            className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 z-10 transition duration-300"
            onClick={handleNextSlide} // Use the handler for the right arrow button
            style={{ right: '0', zIndex: 10 }}
          >
            <ChevronRight className="w-6 h-6 mx-auto" />
          </button>
        </div>
      </div>

      {/* Modal for selected package */}
      {selectedPackage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setSelectedPackage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg overflow-hidden w-full max-w-lg sm:max-w-xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full  mx-auto">
              <img
                src={selectedPackage.imageUrl}
                alt={selectedPackage.title}
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col flex-grow overflow-hidden">
              {/* Content Section */}
              <div className="p-4 overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
                  {selectedPackage.title}
                </h2>
                {/* Header */}
                <p className="text-base text-gray-600 mb-2 font-bold">{selectedPackage.header}</p>
                {/* Subcontent */}
                <div className="text-sm text-gray-700 space-y-2">
                  <p className='font-semibold'>{selectedPackage.subHeader}</p>
                  <p className='pb-5'>{selectedPackage.description}</p>
                  <p>{selectedPackage.shortDescription}</p>
                </div>
              </div>

              {/* Footer with Button */}
              <div className="p-2 bg-gray-100 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
                  onClick={() => setSelectedPackage(null)}
                  aria-label="Close the selected package details"
                >
                  Close
                </button>
              </div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
