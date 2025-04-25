import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const navItems = [
        { label: "Products", path: "/" },
        { label: "Category", path: "/category" },
        { label: "Discount", path: "/discount" },
        { label: "Sizes", path: "/sizes" },
        { label: "Colors", path: "/colors" },
        { label: "Faq", path: "/faq" },
        { label: "Contact", path: "/contact" },
        { label: "Team", path: "/team-members" },
        { label: "News", path: "/news" },
    ];

    return (
        <div className="w-64 bg-gray-800 text-white p-4 fixed h-full flex flex-col items-center">
            <img src="https://aoron.nippon.com.uz/assets/logoWhite-1ybNuyjI.png" alt="Logo" className="w-20 h-20" />
            <ul className="w-full mt-3">
                {navItems.map(({ label, path }) => (
                    <li key={path} className="mb-2 mt-1 w-full">
                        <NavLink
                            to={path}
                            className={({ isActive }) =>
                                `block px-4 py-2 rounded-lg text-center font-medium ${isActive
                                    ? "bg-green-600 text-white font-bold"
                                    : "hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
