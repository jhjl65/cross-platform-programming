// Перевіряє, що обов'язкові поля присутні й не порожні
export function validateTrack(req, res, next) {
  const { title, artist, category, durationSec } = req.body;

  for (const [name, value] of Object.entries({ title, artist, category })) {
    if (typeof value !== "string" || value.trim() === "") {
      return res.status(400).json({ message: `Поле "${name}" є обов'язковим і не може бути порожнім` });
    }
  }

  if (durationSec !== undefined && (typeof durationSec !== "number" || durationSec < 1)) {
    return res.status(400).json({ message: 'Поле "durationSec" має бути додатним числом' });
  }

  next();
}
