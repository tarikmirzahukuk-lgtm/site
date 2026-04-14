import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb://localhost:27017/tarik-site";

const KullaniciSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "yazar" },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const KategoriSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: { type: String, default: "" },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const MakaleSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Kategori" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Kullanici" },
    status: { type: String, default: "yayinda" },
    readingTime: { type: Number, default: 1 },
    tags: [String],
  },
  { timestamps: true }
);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB bağlantısı kuruldu.");

  const Kullanici = mongoose.model("Kullanici", KullaniciSchema);
  const Kategori = mongoose.model("Kategori", KategoriSchema);
  const Makale = mongoose.model("Makale", MakaleSchema);

  // Temizlik
  await Kullanici.deleteMany({});
  await Kategori.deleteMany({});
  await Makale.deleteMany({});

  // Admin kullanıcı
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await Kullanici.create({
    name: "Tarık Mirza",
    email: "tarik@example.com",
    password: hashedPassword,
    role: "admin",
    bio: "Ceza hukuku alanında araştırmalar yapan hukuk öğrencisi. Akademik makaleler, içtihat değerlendirmeleri ve güncel hukuki analizler üzerine yazıyor.",
  });

  // Kategoriler
  const kategoriler = await Kategori.create([
    {
      name: "Ceza Genel Hukuku",
      slug: "ceza-genel-hukuku",
      description: "Ceza hukukunun genel hükümlerine ilişkin makaleler",
      order: 1,
    },
    {
      name: "Ceza Özel Hukuku",
      slug: "ceza-ozel-hukuku",
      description: "Ceza hukukunun özel hükümlerine ilişkin makaleler",
      order: 2,
    },
    {
      name: "Ceza Muhakemesi Hukuku",
      slug: "ceza-muhakemesi-hukuku",
      description: "Ceza muhakemesi hukukuna ilişkin makaleler",
      order: 3,
    },
    {
      name: "İnfaz Hukuku",
      slug: "infaz-hukuku",
      description: "Ceza infaz hukukuna ilişkin makaleler",
      order: 4,
    },
  ]);

  // Örnek makaleler
  await Makale.create([
    {
      title:
        "Ceza Hukukunda Meşru Müdafaanın Sınırları ve Güncel Yargıtay Kararları",
      slug: "ceza-hukukunda-mesru-mudafaanin-sinirlari",
      excerpt:
        "Meşru müdafaa hakkının kullanılabilmesi için saldırının hukuka aykırı olması gerekir. Bu makalede TCK m.25/1 kapsamında meşru müdafaanın koşulları güncel içtihatlar ışığında değerlendirilmektedir.",
      content:
        '<h2>I. Genel Olarak</h2><p>Meşru müdafaa, Türk Ceza Kanunu\'nun 25. maddesinin birinci fıkrasında düzenlenmiş olup, kişinin kendisine veya başkasına yönelmiş haksız bir saldırıyı defetmek amacıyla, zorunlu ve orantılı güç kullanmasını ifade etmektedir.</p><p>Bu hukuka uygunluk nedeni, ceza hukukunun en temel kavramlarından biri olarak, bireyin meşru haklarını korumasına olanak tanır.</p><blockquote><p>"Gerek kendisine ve gerek başkasına ait bir hakka yönelmiş, gerçekleşen, gerçekleşmesi veya tekrarı muhakkak olan haksız bir saldırıyı o anda hal ve koşullara göre saldırı ile orantılı biçimde defetmek zorunluluğu ile işlenen fiillerden dolayı faile ceza verilmez."</p><p>— TCK m.25/1</p></blockquote><h2>II. Meşru Müdafaanın Koşulları</h2><p>Meşru müdafaanın kabul edilebilmesi için saldırıya ve savunmaya ilişkin belirli koşulların bir arada bulunması gerekmektedir:</p><h3>A. Saldırıya İlişkin Koşullar</h3><ul><li>Bir hakka yönelmiş saldırı bulunmalıdır</li><li>Saldırı hukuka aykırı olmalıdır</li><li>Saldırı halen mevcut olmalıdır</li></ul><h3>B. Savunmaya İlişkin Koşullar</h3><ul><li>Savunmada zorunluluk bulunmalıdır</li><li>Savunma saldırı ile orantılı olmalıdır</li></ul><h2>III. Güncel Yargıtay Kararları</h2><p>Yargıtay, meşru müdafaa değerlendirmesinde somut olayın özelliklerini dikkate almakta ve özellikle orantılılık ilkesine büyük önem vermektedir. Yargıtay 1. Ceza Dairesi\'nin yerleşik içtihadına göre, meşru müdafaada saldırının ağırlığı ile savunmanın ağırlığı arasında makul bir oran bulunmalıdır.</p>',
      category: kategoriler[0]._id,
      author: admin._id,
      status: "yayinda",
      readingTime: 8,
      tags: ["meşru müdafaa", "hukuka uygunluk", "TCK"],
    },
    {
      title: "Hırsızlık Suçunda Nitelikli Haller",
      slug: "hirsizlik-sucunda-nitelikli-haller",
      excerpt:
        "TCK m.142'de düzenlenen nitelikli hırsızlık suçunun unsurları ve yaptırımları. Gece vakti, bina içinde, suç örgütü kapsamında işlenen hırsızlık hallerinin incelenmesi.",
      content:
        '<h2>I. Giriş</h2><p>Hırsızlık suçu, Türk Ceza Kanunu\'nun 141. maddesinde temel haliyle düzenlenmiş olup, 142. maddede ise nitelikli halleri sayılmıştır. Nitelikli haller, suçun daha ağır cezayı gerektiren şekilleridir.</p><h2>II. Nitelikli Haller</h2><h3>A. Kamu Kurumu veya İbadethanede İşlenmesi</h3><p>Hırsızlık fiilinin kamu kurumlarında veya ibadete ayrılmış yerlerde işlenmesi halinde ceza artırılır.</p><h3>B. Halkın Yararlanmasına Sunulmuş Eşya Hakkında İşlenmesi</h3><p>Herkesin yararlanmasına sunulmuş ulaşım aracı, elektrik, su gibi kaynaklar hakkında işlenen hırsızlık nitelikli hal teşkil eder.</p>',
      category: kategoriler[1]._id,
      author: admin._id,
      status: "yayinda",
      readingTime: 7,
      tags: ["hırsızlık", "nitelikli hal", "TCK m.142"],
    },
    {
      title: "Tutuklama Kararına İtiraz Yolları",
      slug: "tutuklama-kararina-itiraz-yollari",
      excerpt:
        "CMK m.101 uyarınca tutuklama kararına karşı başvurulabilecek kanun yolları ve itiraz sürecinin detaylı incelenmesi.",
      content:
        '<h2>I. Tutuklamanın Hukuki Niteliği</h2><p>Tutuklama, ceza muhakemesi hukukunda en ağır koruma tedbiridir. Kişi özgürlüğünü doğrudan kısıtlayan bu tedbir, ancak kanunda belirtilen koşulların varlığı halinde uygulanabilir.</p><h2>II. İtiraz Hakkı</h2><p>CMK m.101/5 uyarınca, tutuklama kararına karşı itiraz yoluna başvurulabilir. İtiraz, kararı veren makamın bir üst makamına yapılır.</p>',
      category: kategoriler[2]._id,
      author: admin._id,
      status: "yayinda",
      readingTime: 6,
      tags: ["tutuklama", "itiraz", "CMK"],
    },
    {
      title: "Taksirle Öldürme Suçunda Cezai Sorumluluk",
      slug: "taksirle-oldurme-sucunda-cezai-sorumluluk",
      excerpt:
        "TCK m.85 kapsamında taksirle öldürme suçunun unsurları, bilinçli taksir ayrımı ve cezai sorumluluk şartlarının değerlendirilmesi.",
      content:
        '<h2>I. Taksir Kavramı</h2><p>Taksir, dikkat ve özen yükümlülüğüne aykırılık dolayısıyla bir davranışın suçun kanuni tanımında belirtilen neticesi öngörülmeyerek gerçekleştirilmesidir (TCK m.22/2).</p><h2>II. Bilinçli Taksir</h2><p>Kişinin öngördüğü neticeyi istememesine karşın neticenin meydana gelmesi halinde bilinçli taksir söz konusu olur.</p>',
      category: kategoriler[0]._id,
      author: admin._id,
      status: "yayinda",
      readingTime: 5,
      tags: ["taksir", "taksirle öldürme", "bilinçli taksir"],
    },
    {
      title: "İştirak Halleri ve Yardım Etme Kavramı",
      slug: "istirak-halleri-ve-yardim-etme",
      excerpt:
        "TCK m.37-41 arasında düzenlenen iştirak hallerinin karşılaştırmalı incelemesi. Müşterek faillik, azmettirme ve yardım etme kavramlarının analizi.",
      content:
        '<h2>I. İştirak Kavramı</h2><p>İştirak, birden fazla kişinin bir suçun işlenmesine katılmasıdır. TCK\'da iştirak halleri; faillik, azmettirme ve yardım etme olarak düzenlenmiştir.</p>',
      category: kategoriler[0]._id,
      author: admin._id,
      status: "taslak",
      readingTime: 10,
      tags: ["iştirak", "müşterek faillik", "yardım etme"],
    },
  ]);

  console.log("Seed verileri başarıyla oluşturuldu:");
  console.log("- 1 admin kullanıcı (tarik@example.com / admin123)");
  console.log("- 4 kategori");
  console.log("- 5 makale (4 yayında, 1 taslak)");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed hatası:", err);
  process.exit(1);
});
