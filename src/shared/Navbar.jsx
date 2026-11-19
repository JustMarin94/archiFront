import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="relative h-24 flex justify-between items-center px-8">
      {/* Right side - Desktop Home + Languages */}
      <div className="md:flex items-center gap-8 ml-auto">
        <Link
          to="/"
          className="text-lg font-bold uppercase hover:text-gray-600 transition"
        >
          {t("nav.home")}
        </Link>

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
    </nav>
  );
};

export default Navbar;
