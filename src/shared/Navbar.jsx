import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <nav className="relative h-24 flex justify-center items-center">
      <button
        onClick={() => setOpenMenu(!openMenu)}
        className="flex flex-col gap-2"
        aria-label="Toggle menu"
      >
        <span className="w-10 h-1 bg-black"></span>
        <span className="w-10 h-1 bg-black"></span>
        <span className="w-10 h-1 bg-black"></span>
      </button>

      {openMenu && (
        <div className="absolute top-24 bg-white shadow-xl p-8 flex flex-col gap-5 z-50">
          <Link
            to="/"
            className="text-xl font-bold uppercase"
            onClick={() => setOpenMenu(false)}
          >
            Početna
          </Link>

          <Link
            to="/filter"
            className="text-xl font-bold uppercase"
            onClick={() => setOpenMenu(false)}
          >
            Pretraga
          </Link>

          <Link
            to="/admin"
            className="text-xl font-bold uppercase"
            onClick={() => setOpenMenu(false)}
          >
            Unos
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
