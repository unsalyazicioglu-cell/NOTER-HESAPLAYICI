module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      hata: "Sadece POST isteği kabul edilir."
    });
  }

  try {

    const veri = req.body;

    const prompt = `

Marka: ${veri.marka}
Model: ${veri.model}
Paket: ${veri.paket}
Yıl: ${veri.yil}
Yakıt: ${veri.yakit}
Vites: ${veri.vites}
KM: ${veri.km}
Tramer: ${veri.tramer}
Ağır Hasar Kaydı: ${veri.agirHasar}
Kasko Değeri: ${veri.kaskoDegeri}
İl: ${veri.il}
Cam Tavan / Sunroof: ${veri.sunroof}
Ön Şase: ${veri.onSase}
Arka Şase: ${veri.arkaSase}
Sağ Podye: ${veri.sagPodye}
Sol Podye: ${veri.solPodye}
Bagaj Havuzu: ${veri.bagajHavuzu}
Direkler: ${veri.direkler}
Ekspertiz: ${veri.ekspertiz}

Türkiye ikinci el otomobil piyasasında uzman bir oto ekspertiz ve araç değerleme danışmanısın.

Verilen araç bilgilerine göre Türkiye ikinci el otomobil piyasasında gerçekçi bir satış değeri belirle.

Değerlendirme yaparken:

Marka ve modelin piyasadaki talebini
Aracın model yılını
Kilometresini
Yakıt ve vites tipini
Donanım özelliklerini
Tramer geçmişini
Ağır hasar kaydını
Kaporta ekspertiz bilgilerini
Şase, podye ve bagaj havuzu durumunu
Araç üzerindeki boya ve değişen sayısını
Türkiye ikinci el piyasasındaki alıcı davranışlarını

birlikte değerlendir.

Sadece matematiksel indirimler uygulama.

Örneğin:

Her boyalı parça ciddi değer kaybı oluşturmaz.
Tek parça değişen birçok araçta normal kabul edilir.
Talebi yüksek araçlarda kilometre etkisi daha düşük olabilir.
Ağır hasar, şase işlemi ve podye işlemleri daha ciddi değer kaybı oluşturur.
BMW, Mercedes-Benz, Audi, Volkswagen, Porsche, Tesla ve benzeri talep gören araçlarda piyasa gerçeklerini dikkate al.

Amaç ekspertiz raporu üretmek değil, gerçekçi satış fiyatı tahmini üretmektir.

Fiyatlar:

Hızlı satılabilir fiyat
Ortalama piyasa fiyatı
Sabırlı satış fiyatı

mantığına göre oluşturulmalıdır.

SADECE aşağıdaki JSON formatında cevap ver:
{
"minimumDeger":"",
"ortalamaDeger":"",
"maksimumDeger":"",
"satilabilirlik":"",
"tahminiSatisSuresi":"",
"guvenPuani":"",
"yorum":""
}
`;

    const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

const data = await response.json();

const text =
  data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

const temiz = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {

  const sonuc = JSON.parse(temiz);

  return res.status(200).json(sonuc);

} catch {

  return res.status(200).json({
    yorum: temiz
  });

}

  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }

};


