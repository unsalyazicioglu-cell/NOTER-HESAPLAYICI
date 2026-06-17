module.exports = async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      hata: "Sadece POST isteği kabul edilir."
    });
  }

  try {

    const veri = req.body;

    const prompt = `
Sen Türkiye ikinci el araç piyasasında uzman bir araç değerleme danışmanısın.

Marka: ${veri.marka}
Model: ${veri.model}
Paket: ${veri.paket}
Yıl: ${veri.yil}
Yakıt: ${veri.yakit}
Vites: ${veri.vites}
KM: ${veri.km}
Tramer: ${veri.tramer}
İl: ${veri.il}
Cam Tavan / Sunroof: ${veri.sunroof}
Ön Şase: ${veri.onSase}
Arka Şase: ${veri.arkaSase}

Sağ Podye: ${veri.sagPodye}
Sol Podye: ${veri.solPodye}

Bagaj Havuzu: ${veri.bagajHavuzu}

Direkler: ${veri.direkler}
Ekspertiz: ${veri.ekspertiz}
Cam tavan / sunroof bulunan araçların piyasa değeri ve satılabilirliği üzerinde pozitif etkisini dikkate al.

Araçta sunroof yoksa buna göre değerlendirme yap.

Türkiye ikinci el araç piyasasında uzman bir araç değerleme danışmanısın.

Araç değerini belirlerken Türkiye ikinci el piyasasını ve özellikle sahibinden.com üzerindeki benzer emsal araçların fiyat seviyelerini baz al.

Fiyat belirlerken:

Marka
Model
Paket
Model yılı
Kilometre
Tramer
Kaporta durumu
Değişen parça sayısı
Boyalı parça sayısı
Şase işlemleri
Podye işlemleri
Bagaj havuzu işlemleri
Direk işlemleri
Cam tavan / sunroof durumu

kriterlerini dikkate al.

Temiz emsaller ile hasarlı emsalleri ayır.

İlan fiyatı değil, gerçekleşebilir satış fiyatı tahmini üret.

Piyasada uzun süredir satılmayan yüksek fiyatlı ilanları baz alma.

Gerçekçi ve satılabilir fiyatlar ver.

Minimum değer:
Galericinin hızlı satabileceği fiyat.

Ortalama değer:
Piyasa satış ortalaması.

Maksimum değer:
Sabırlı satışta ulaşılabilecek fiyat.

Satılabilirlik ve satış süresini de buna göre hesapla.

SADECE JSON DÖNDÜR.

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


