import { NavLink, useNavigate } from "react-router-dom";
import { FiUsers, FiMessageSquare, FiBarChart2, FiLogOut } from "react-icons/fi"; // 🎨 Icons

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
          {/* Users List */}
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center py-3 px-6 transition duration-300 ${
                  isActive ? "bg-red-500 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <FiUsers className="mr-3" />
              Users List
            </NavLink>
          </li>

          {/* Reviews List */}
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `flex items-center py-3 px-6 transition duration-300 ${
                  isActive ? "bg-red-500 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <FiMessageSquare className="mr-3" />
              Reviews List
            </NavLink>
          </li>

          {/* Stats Page */}
          <li>
            <NavLink
              to="/admin/stats"
              className={({ isActive }) =>
                `flex items-center py-3 px-6 transition duration-300 ${
                  isActive ? "bg-red-500 text-white" : "hover:bg-gray-700"
                }`
              }
            >
              <FiBarChart2 className="mr-3" />
              Stats
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 flex items-center justify-center text-white py-3 px-6 transition duration-300 w-full"
      >
        <FiLogOut className="mr-3" />
        Logout
      </button>
    </aside>
  );
};

export default Sidenavbar;
