import { IKullanici } from "@/types";

export default function YazarKarti({ yazar }: { yazar: IKullanici }) {
  return (
    <div className="border-t border-gray-border pt-8 mt-12">
      <div className="flex gap-4 items-start bg-gray-light/50 rounded-xl p-6">
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 overflow-hidden">
          {yazar.avatar ? (
            <img
              src={yazar.avatar}
              alt={yazar.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            yazar.name.charAt(0)
          )}
        </div>
        <div>
          <p className="font-bold text-dark">{yazar.name}</p>
          {yazar.bio && (
            <p className="text-sm text-gray-text mt-1 leading-relaxed">
              {yazar.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
