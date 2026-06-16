export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      hata: "Sadece POST isteği kabul edilir."
    });
  }

  try {

    const veri = req.body;

    const prompt = `
Sen Türkiye'de çalışan uzman ikinci el araç değerleme uzmanısın.

Araç Bilgileri:

Marka: ${veri.marka}
Model: ${veri.model}
Paket: ${veri.paket}

Yıl: ${veri.yil}
Yakıt: ${veri.yakit}
Vites: ${veri.vites}

KM: ${veri.km}
Tramer: ${veri.tramer}

İl: ${veri.il}

Ekspertiz:
${veri.ekspertiz}

Kurallar:

1- Sadece JSON döndür.
2- Açıklama yazma.
3- Markdown kullanma.
4- Kod bloğu kullanma.

JSON formatı:

{
  "minimumDeger":"",
  "ortalamaDeger":"",
  "maksimumDeger":"",
  "satilabilirlik":"",
  "tahminiSatisSuresi":"",
  "guvenPuani":"",
  "yorum":""
}

Satılabilirlik sadece:

🚀 Çok Hızlı Satılır
🟢 Hızlı Satılır
🟡 Ortalama Sürede Satılır
🟠 Yavaş Satılır
🔴 Zor Satılır

olabilir.
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

    let text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const sonuc = JSON.parse(text);

    return res.status(200).json(sonuc);

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      minimumDeger: "-",
      ortalamaDeger: "-",
      maksimumDeger: "-",
      satilabilirlik: "Hesaplanamadı",
      tahminiSatisSuresi: "-",
      guvenPuani: "0",
      yorum: err.message
    });

  }

}
