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

Türkiye ikinci el araç piyasasında uzman bir araç değerleme danışmanısın.

2026 yılı Türkiye ikinci el otomobil piyasasını baz alarak değerleme yap.

Araç için gönderilen Kasko Değeri, marka, model, model yılı, kilometre, yakıt tipi, vites tipi, tramer kaydı, ağır hasar durumu, sunroof bilgisi, şase işlemleri, podye işlemleri, bagaj havuzu işlemleri ve kaporta ekspertiz bilgilerini birlikte değerlendir.

Kasko değeri piyasa fiyatı değildir ancak önemli bir referans noktasıdır.

Fiyat belirlerken:

Marka ve modelin Türkiye ikinci el piyasasındaki talebini dikkate al.
BMW, Mercedes-Benz, Audi, Volkswagen, Porsche, Land Rover gibi markalarda piyasa değerini gereksiz yere düşürme.
Sadece boya bulunan araçlarda aşırı değer kaybı uygulama.
Değişen parça, ağır hasar, şase işlemi ve podye işlemlerinde daha yüksek değer kaybı uygula.
Kilometreyi emsal araçlarla kıyaslayarak değerlendir.
Sunroof ve cam tavan gibi donanımları artı değer olarak değerlendir.
Ağır hasar kaydı varsa piyasa algısını dikkate al.
Sonuçlar gerçek ikinci el satış fiyatlarına yakın olsun.

ÇOK ÖNEMLİ:

Kasko değeri referans alınarak hesaplama yap.

Normal şartlarda minimum değer, kasko değerinin %75'inin altına düşmesin.

Satılabilirlik ve satış süresi tahminlerini de gerçek piyasa koşullarına göre üret.

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


