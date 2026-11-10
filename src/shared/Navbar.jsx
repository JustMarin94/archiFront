import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <--- Import hook

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { i18n, t } = useTranslation(); // <--- Initialize translation hook
  const currentLang = i18n.language;

  const navigate = useNavigate();

  const isAuthenticated =
    localStorage.getItem("isAdminAuthenticated") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setOpenMenu(false);
    navigate("/");
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="relative h-24 flex justify-between items-center px-8">
      <div className="w-10"></div>

      <div className="flex items-center gap-8">
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="flex flex-col gap-2 cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className="w-10 h-1 bg-black"></span>
          <span className="w-10 h-1 bg-black"></span>
          <span className="w-10 h-1 bg-black"></span>
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-2 text-sm font-bold">
          <button
            onClick={() => changeLanguage("hr")}
            className={`transition ${
              currentLang === "hr"
                ? "text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            HR
          </button>

          <span className="text-gray-300">|</span>

          <button
            onClick={() => changeLanguage("en")}
            className={`transition ${
              currentLang === "en"
                ? "text-black"
                : "text-gray-400 hover:text-black"
            }`}
          >
            ENG
          </button>
        </div>
      </div>

      <div className="w-10 text-right">
        {!isAuthenticated && (
          <Link
            to="/login"
            className="text-xs uppercase font-bold text-gray-400 hover:text-black"
          >
            Admin
          </Link>
        )}
      </div>

      {openMenu && (
        <div className="absolute top-24 right-8 bg-white shadow-xl border border-gray-100 rounded-xl p-6 flex flex-col gap-4 z-50 min-w-[200px]">
          <Link
            to="/"
            className="text-lg font-bold uppercase hover:text-gray-600 transition"
            onClick={() => setOpenMenu(false)}
          >
            {t("nav.home")}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                className="text-lg font-bold uppercase text-blue-600 hover:text-blue-800 transition"
                onClick={() => setOpenMenu(false)}
              >
                {t("nav.admin")}
              </Link>

              <button
                onClick={handleLogout}
                className="text-left text-lg font-bold uppercase text-red-600 hover:text-red-800 transition"
              >
                {t("nav.logout")}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-lg font-bold uppercase text-gray-400 hover:text-black transition"
              onClick={() => setOpenMenu(false)}
            >
              {t("nav.login")}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
