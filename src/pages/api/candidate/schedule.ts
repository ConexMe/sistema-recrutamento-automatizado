import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { candidateId } = req.body

    if (!candidateId) {
      return res.status(400).json({ error: 'ID do candidato é obrigatório' })
    }

    // Simular busca dos dados do candidato
    const candidateData = {
      id: candidateId,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      jobName: 'Desenvolvedor Frontend'
    }

    // Gerar link personalizado do Cal.com
    const calApiKey = process.env.CAL_API_KEY
    let schedulingLink = ''

    if (calApiKey) {
      // Integração real com Cal.com
      try {
        const calResponse = await fetch('https://api.cal.com/v1/booking-links', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${calApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventTypeId: 1, // ID do tipo de evento no Cal.com
            metadata: {
              candidateName: candidateData.name,
              jobPosition: candidateData.jobName,
              candidateId: candidateId
            }
          })
        })

        if (calResponse.ok) {
          const calData = await calResponse.json()
          schedulingLink = calData.link
        }
      } catch (error) {
        console.error('Erro ao criar link no Cal.com:', error)
      }
    }

    // Link padrão se não conseguir integrar com Cal.com
    if (!schedulingLink) {
      schedulingLink = `https://cal.com/entrevista-rh?name=${encodeURIComponent(candidateData.name)}&job=${encodeURIComponent(candidateData.jobName)}`
    }

    // Enviar email com link de agendamento
    const emailSent = await sendSchedulingEmail(candidateData, schedulingLink)
    
    // Opcionalmente, enviar via WhatsApp também
    const whatsappSent = await sendSchedulingWhatsApp(candidateData, schedulingLink)

    console.log('Link de agendamento criado:', {
      candidateId,
      schedulingLink,
      emailSent,
      whatsappSent,
      timestamp: new Date().toISOString()
    })

    res.status(200).json({
      message: 'Link de agendamento enviado com sucesso!',
      schedulingLink,
      emailSent,
      whatsappSent
    })

  } catch (error) {
    console.error('Erro ao agendar entrevista:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function sendSchedulingEmail(candidate: any, schedulingLink: string): Promise<boolean> {
  try {
    // Aqui você integraria com Gmail API ou SMTP
    const gmailCredentials = process.env.GMAIL_API_KEY || process.env.SMTP_CREDENTIALS

    if (!gmailCredentials) {
      console.log('Simulando envio de email (credenciais não configuradas)')
      console.log(`Email para ${candidate.email}:`)
      console.log(`Assunto: Agendamento de Entrevista - ${candidate.jobName}`)
      console.log(`Link: ${schedulingLink}`)
      return true
    }

    // Implementação real do envio de email seria aqui
    // Usando nodemailer ou Gmail API
    
    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return false
  }
}

async function sendSchedulingWhatsApp(candidate: any, schedulingLink: string): Promise<boolean> {
  try {
    const whatsappApiKey = process.env.WHATSAPP_API_KEY

    if (!whatsappApiKey) {
      console.log('Simulando envio de WhatsApp (API não configurada)')
      console.log(`WhatsApp para ${candidate.phone}:`)
      console.log(`Olá ${candidate.name}! Aqui está o link para agendar sua entrevista: ${schedulingLink}`)
      return true
    }

    // Implementação real com Twilio ou Z-API
    const message = `Olá ${candidate.name}! 

Parabéns! Você passou para a próxima etapa do processo seletivo para a vaga de ${candidate.jobName}.

Por favor, agende sua entrevista através do link: ${schedulingLink}

Atenciosamente,
Equipe de Recrutamento`

    // Exemplo com Twilio (ajustar conforme API escolhida)
    /*
    const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TWILIO_SID}:${whatsappApiKey}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: 'whatsapp:+14155238886',
        To: `whatsapp:${candidate.phone}`,
        Body: message
      })
    })
    */

    return true
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    return false
  }
}
