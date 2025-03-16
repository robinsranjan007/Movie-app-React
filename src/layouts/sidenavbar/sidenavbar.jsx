import { NavLink, useNavigate } from "react-router-dom";

const Sidenavbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 flex justify-center items-center p-4 text-xl font-bold">
        Admin Dashboard
      </div>

      {/* Admin Name */}
      <div className="text-center p-4 text-lg font-semibold border-b border-gray-700">
        {username || "Admin"}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block py-3 px-6 transition duration-300 ${
                  isActive ? "bg-red-500 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              Users List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/movies"
              className={({ isActive }) =>
                `block py-3 px-6 transition duration-300 ${
                  isActive ? "bg-red-500 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              Movies List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/tvshows"
              className={({ isActive }) =>
                `block py-3 px-6 transition duration-300 ${
                  isActive ? "bg-red-500 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              TV List
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 transition duration-300 w-full"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidenavbar;
