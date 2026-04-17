import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
};

export default function IletisimPage() {
  return (
    <div className="max-w-content mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold mb-4">İletişim</h1>
      <p className="text-gray-text mb-10">
        Soru, öneri veya iş birliği teklifleri için aşağıdaki kanallardan
        bana ulaşabilirsiniz.
      </p>

      <div className="space-y-6">
        <div className="bg-gray-light/50 rounded-xl p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-text mb-2">
            E-posta
          </h3>
          <a
            href="mailto:tarik@example.com"
            className="text-primary hover:underline"
          >
            tarik@example.com
          </a>
        </div>

        <div className="bg-gray-light/50 rounded-xl p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-text mb-2">
            LinkedIn
          </h3>
          <p className="text-dark">linkedin.com/in/tarikmirza</p>
        </div>
      </div>
    </div>
  );
}
