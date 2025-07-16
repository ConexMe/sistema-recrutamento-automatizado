import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { candidateId, feedbackType } = req.body

    if (!candidateId) {
      return res.status(400).json({ error: 'ID do candidato é obrigatório' })
    }

    // Simular dados do candidato
    const candidateData = {
      id: candidateId,
      name: 'João Silva',
      phone: '5511999999999', // Formato internacional para WhatsApp
      jobName: 'Desenvolvedor Frontend',
      fit: feedbackType || 'positivo'
    }

    // Preparar mensagem personalizada baseada no tipo de feedback
    let message = ''
    
    if (candidateData.fit === 'positivo' || candidateData.fit === 'fit') {
      message = `Olá ${candidateData.name}! 🎉

Temos uma excelente notícia! Você foi aprovado(a) no processo seletivo para a vaga de ${candidateData.jobName}.

Parabéns pelo seu desempenho! Nossa equipe ficou muito impressionada com seu perfil e experiência.

Em breve entraremos em contato para os próximos passos do processo de contratação.

Atenciosamente,
Equipe de Recrutamento`
    } else {
      message = `Olá ${candidateData.name}!

Agradecemos seu interesse na vaga de ${candidateData.jobName} e o tempo dedicado ao nosso processo seletivo.

Após cuidadosa análise, decidimos seguir com outros candidatos neste momento. Isso não diminui suas qualificações - apenas encontramos um perfil mais alinhado com nossas necessidades específicas atuais.

Manteremos seu currículo em nosso banco de talentos para futuras oportunidades que possam ser mais adequadas ao seu perfil.

Desejamos muito sucesso em sua carreira!

Atenciosamente,
Equipe de Recrutamento`
    }

    // Enviar feedback via WhatsApp
    const whatsappSent = await sendWhatsAppMessage(candidateData.phone, message)

    if (whatsappSent) {
      console.log('Feedback enviado:', {
        candidateId,
        phone: candidateData.phone,
        feedbackType: candidateData.fit,
        timestamp: new Date().toISOString()
      })

      res.status(200).json({
        message: 'Feedback enviado com sucesso via WhatsApp!',
        sentTo: candidateData.phone,
        feedbackType: candidateData.fit,
        sentAt: new Date().toISOString()
      })
    } else {
      res.status(500).json({ error: 'Falha ao enviar feedback via WhatsApp' })
    }

  } catch (error) {
    console.error('Erro ao enviar feedback:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  try {
    const whatsappApiKey = process.env.WHATSAPP_API_KEY

    if (!whatsappApiKey) {
      console.log('Simulando envio de WhatsApp (API não configurada)')
      console.log(`Para: ${phone}`)
      console.log(`Mensagem: ${message}`)
      return true
    }

    // Implementação com Twilio WhatsApp API
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = whatsappApiKey
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: 'whatsapp:+14155238886', // Número do Twilio
        To: `whatsapp:+${phone}`,
        Body: message
      })
    })

    return response.ok
    */

    // Implementação com Z-API (alternativa brasileira)
    /*
    const response = await fetch(`https://api.z-api.io/instances/YOUR_INSTANCE/token/YOUR_TOKEN/send-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        message: message
      })
    })

    return response.ok
    */

    return true
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    return false
  }
}
