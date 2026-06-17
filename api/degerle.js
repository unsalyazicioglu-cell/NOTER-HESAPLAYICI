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

Yukarıda belirlenen özelliklere göre sahibinden.com ve arabam.com sitelerini kaynak olarak gör real bir sonuç ver

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


