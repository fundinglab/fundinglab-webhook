export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Dummy response zum Testen
  res.status(200).json({ message: 'Webhook funktioniert!' });
}
