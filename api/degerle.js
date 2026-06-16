````javascript
export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      hata: "Sadece POST isteği kabul edilir."
    });
  }

  try {

    const veri = req.body;

    const prompt = `
Sen Türkiye ikinci el araç piyasasında uzman araç değerleme danışmanısın.

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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!text) {

      return res.status(500).json({
        minimumDeger: "-",
        ortalamaDeger: "-",
        maksimumDeger: "-",
        satilabilirlik: "Hata",
        tahminiSatisSuresi: "-",
        guvenPuani: "0",
        yorum: JSON.stringify(data)
      });

    }

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {

      const sonuc = JSON.parse(text);

      return res.status(200).json(sonuc);

    } catch {

      return res.status(200).json({
        minimumDeger: "-",
        ortalamaDeger: "-",
        maksimumDeger: "-",
        satilabilirlik: "AI Cevabı",
        tahminiSatisSuresi: "-",
        guvenPuani: "0",
        yorum: text
      });

    }

  } catch (err) {

    return res.status(500).json({
      minimumDeger: "-",
      ortalamaDeger: "-",
      maksimumDeger: "-",
      satilabilirlik: "Hata",
      tahminiSatisSuresi: "-",
      guvenPuani: "0",
      yorum: err.message
    });

  }

}
````
