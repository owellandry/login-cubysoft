"use client";

import { MdDescription } from "react-icons/md";

const FloatingDocButton = () => (
  <a
    href="/doc"
    className="fixed bottom-10 right-10 p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500 transition-transform duration-300 transform hover:scale-110"
  >
    <MdDescription size={24} className="text-white" />
  </a>
);

export default FloatingDocButton;
