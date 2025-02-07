export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, type, identifier } = req.body;

  try {
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
        type,
        identifier,
        expiresAt: {
          gt: new Date()
        },
        used: false
      }
    });

    if (!verificationCode) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { used: true }
    });

    res.status(200).json({ message: 'Code verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Failed to verify code' });
  }
}