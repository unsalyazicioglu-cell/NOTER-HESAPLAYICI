export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({
hata: "Sadece POST isteği kabul edilir."
});
}

try {

```
const veri = req.body;

const prompt = `
```

Sen Türkiye ikinci el araç piyasasında uzman bir araç değerleme danışmanısın.

Aşağıdaki araç için analiz yap.

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

satilabilirlik alanı sadece:

🚀 Çok Hızlı Satılır
🟢 Hızlı Satılır
🟡 Ortalama Sürede Satılır
🟠 Yavaş Satılır
🔴 Zor Satılır

olabilir.
`;

````
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

const text =
  data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

if (!text) {

  return res.status(200).json({
    minimumDeger: "-",
    ortalamaDeger: "-",
    maksimumDeger: "-",
    satilabilirlik: "Hata",
    tahminiSatisSuresi: "-",
    guvenPuani: "0",
    yorum: JSON.stringify(data)
  });

}

const temiz = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {

  const sonuc = JSON.parse(temiz);

  return res.status(200).json(sonuc);

} catch {

  return res.status(200).json({
    minimumDeger: "-",
    ortalamaDeger: "-",
    maksimumDeger: "-",
    satilabilirlik: "AI Yanıtı",
    tahminiSatisSuresi: "-",
    guvenPuani: "0",
    yorum: temiz
  });

}
````

} catch (err) {

```
return res.status(500).json({
  minimumDeger: "-",
  ortalamaDeger: "-",
  maksimumDeger: "-",
  satilabilirlik: "Sistem Hatası",
  tahminiSatisSuresi: "-",
  guvenPuani: "0",
  yorum: err.message
});
```

}

}
