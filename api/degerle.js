:::writing{variant="document" id="42851"}
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
Ekspertiz: ${veri.ekspertiz}

SADECE JSON DÖNDÜR.
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

return res.status(200).json({
  apiKeyVar: !!process.env.GEMINI_API_KEY,
  googleCevap: data
});

  } catch (err) {

    return res.status(500).json({
      hata: err.message
    });

  }

};
:::

