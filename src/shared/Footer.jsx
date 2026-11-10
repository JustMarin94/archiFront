import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white px-2 md:px-40 py-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-16">
        {/* Brand */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-black leading-none">
              ARHITEKTURA
              <br />
              JADRANA
            </h2>

            <p className="mt-6 text-sm text-gray-300 max-w-xs">
              {t("footer.description")}
            </p>
          </div>
        </div>

        {/* Legal / Support Section (Right Aligned) */}
        <div className="flex flex-col space-y-6 md:items-start">
          <h3 className="text-xl font-semibold">{t("footer.support")}</h3>

          <div>
            <img
              src="https://res.cloudinary.com/s5jhkmwh/image/upload/v1792611514/WhatsApp_Image_2026-10-21_at_21.25.01.jpg"
              alt={t("footer.supportAlt")}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-20 pt-8 border-t border-white/30">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <p className="text-sm text-gray-300">© Onda 2026</p>

          <p className="text-sm underline cursor-pointer">
            {t("footer.submitSuggestions")}
          </p>
        </div>
      </div>
    </footer>
  );
}
