/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useAxiosPublic from '../../Hooks/UseAxiosPublic';
import Slider from 'react-slick'; // Import the slider
import 'slick-carousel/slick/slick.css'; // Slider styles
import 'slick-carousel/slick/slick-theme.css'; // Slider theme

function NewsSlider({ announcements }) {
  const sliderSettings = {
    dots: false, // No dots for navigation
    infinite: true, // Infinite loop for sliding
    speed: 2000, // Transition speed for each slide (2 seconds)
    autoplay: true, // Enables auto-sliding
    autoplaySpeed: 5000, // Time between slides (5 seconds)
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    arrows: false, // Disable navigation arrows
    fade: true, // Fade transition effect
  };

  return (
    <div className="relative border-2 bg-gradient-to-r   from-orange-500 to-orange-300 py-6 px-4">
      {announcements.length > 0 ? (
        <Slider {...sliderSettings}>
          {announcements.map((announcement, index) => (
            <div
              key={announcement._id || index} // Unique key for each announcement
              className="flex items-center justify-center h-full" // Center the content vertically and horizontally
            >
              <p className="text-center font-bold text-white text-xl sm:text-2xl md:text-2xl lg:text-2xl mx-auto px-12">
                {announcement.title} - {announcement.content}
              </p>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-white text-xl">Loading announcements...</p>
      )}
    </div>
  );
}

export default function Navbar() {
  const [announcements, setAnnouncements] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axiosPublic.get('/news'); // Replace with the correct endpoint
        setAnnouncements(response.data); // Assuming the response data is in the form you need
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white text-blue-900">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="w-40">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-tJda3re8jLVoRy9DiCugIu6r1AEsR9.png"
            alt="Naria Holidays"
            className="object-contain w-full"
          />
        </div>
        <div className="hidden md:flex space-x-6">
          <NavLink
            to="/"
            className="hover:text-orange-500 transition duration-300 font-bold"
          >
            Home
          </NavLink>
          <NavLink
            to="#contact"
            className="hover:text-orange-500 transition duration-300 font-bold"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('footer').scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Contact
          </NavLink>
        </div>
        <button
          className="md:hidden text-blue-900 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <NavLink
              to="/"
              className="block py-2 hover:text-orange-500 transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="#contact"
              className="block py-2 hover:text-orange-500 transition duration-300"
              onClick={(e) => {
                e.preventDefault();
                setIsMenuOpen(false);
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Contact
            </NavLink>
          </div>
        </div>
      )}

      {/* Announcement Slider */}
      <NewsSlider announcements={announcements} />
    </header>
  );
}
