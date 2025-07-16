import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { openrouter, cal, gmail, whatsapp } = req.body

      // Em um cenário real, as chaves seriam salvas de forma segura (criptografadas)
      console.log('Chaves de API atualizadas:', {
        openrouter: openrouter ? '***configurada***' : 'não configurada',
        cal: cal ? '***configurada***' : 'não configurada', 
        gmail: gmail ? '***configurada***' : 'não configurada',
        whatsapp: whatsapp ? '***configurada***' : 'não configurada',
        updatedAt: new Date().toISOString()
      })

      res.status(200).json({ 
        message: 'Chaves de API salvas com sucesso!',
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Erro ao salvar chaves:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}
