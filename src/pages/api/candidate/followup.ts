import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { candidateId, companyEmail } = req.body

    if (!candidateId) {
      return res.status(400).json({ error: 'ID do candidato é obrigatório' })
    }

    // Simular dados do candidato e empresa
    const candidateData = {
      id: candidateId,
      name: 'João Silva',
      jobName: 'Desenvolvedor Frontend',
      interviewDate: new Date().toISOString().split('T')[0],
      reportSentDate: new Date().toISOString().split('T')[0]
    }

    const companyData = {
      email: companyEmail || 'cliente@empresa.com',
      name: 'Empresa Cliente'
    }

    // Iniciar sequência de follow-up emails
    const followupSequence = await startFollowupSequence(candidateData, companyData)

    if (followupSequence.success) {
      console.log('Follow-up iniciado:', {
        candidateId,
        companyEmail: companyData.email,
        sequenceId: followupSequence.sequenceId,
        timestamp: new Date().toISOString()
      })

      res.status(200).json({
        message: 'Sequência de follow-up iniciada com sucesso!',
        sequenceId: followupSequence.sequenceId,
        companyEmail: companyData.email,
        nextEmailAt: followupSequence.nextEmailAt,
        totalEmails: followupSequence.totalEmails
      })
    } else {
      res.status(500).json({ error: 'Falha ao iniciar sequência de follow-up' })
    }

  } catch (error) {
    console.error('Erro ao iniciar follow-up:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function startFollowupSequence(candidateData: any, companyData: any) {
  try {
    const sequenceId = `followup_${candidateData.id}_${Date.now()}`
    
    // Definir sequência de emails (a cada 48 horas)
    const followupEmails = [
      {
        delay: 0, // Primeiro email imediato
        subject: `Follow-up: Relatório de ${candidateData.name} - ${candidateData.jobName}`,
        template: 'first_followup'
      },
      {
        delay: 48, // 48 horas depois
        subject: `Lembrete: Feedback sobre ${candidateData.name} - ${candidateData.jobName}`,
        template: 'second_followup'
      },
      {
        delay: 96, // 96 horas (4 dias) depois
        subject: `Última oportunidade: ${candidateData.name} - ${candidateData.jobName}`,
        template: 'final_followup'
      }
    ]

    // Enviar primeiro email imediatamente
    const firstEmailSent = await sendFollowupEmail(
      companyData.email,
      followupEmails[0].subject,
      generateFollowupEmailContent(candidateData, companyData, 'first_followup')
    )

    if (!firstEmailSent) {
      return { success: false }
    }

    // Agendar emails subsequentes (em um cenário real, usaria um sistema de filas como Bull/Agenda)
    console.log('Agendando emails de follow-up:', {
      sequenceId,
      emails: followupEmails.slice(1).map(email => ({
        scheduledFor: new Date(Date.now() + email.delay * 60 * 60 * 1000).toISOString(),
        subject: email.subject
      }))
    })

    return {
      success: true,
      sequenceId,
      nextEmailAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      totalEmails: followupEmails.length
    }

  } catch (error) {
    console.error('Erro na sequência de follow-up:', error)
    return { success: false }
  }
}

async function sendFollowupEmail(email: string, subject: string, content: string): Promise<boolean> {
  try {
    const gmailCredentials = process.env.GMAIL_API_KEY || process.env.SMTP_CREDENTIALS

    if (!gmailCredentials) {
      console.log('Simulando envio de follow-up email (credenciais não configuradas)')
      console.log(`Para: ${email}`)
      console.log(`Assunto: ${subject}`)
      console.log(`Conteúdo: ${content}`)
      return true
    }

    return true
  } catch (error) {
    console.error('Erro ao enviar follow-up email:', error)
    return false
  }
}

function generateFollowupEmailContent(candidateData: any, companyData: any, template: string): string {
  const baseContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #2c3e50; margin: 0;">Sistema de Recrutamento</h2>
      </div>
  `

  const footer = `
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px; text-align: center;">
        Este email foi enviado automaticamente pelo Sistema de Recrutamento.
      </p>
    </div>
  `

  switch (template) {
    case 'first_followup':
      return baseContent + `
        <p>Prezado(a) ${companyData.name},</p>
        
        <p>Enviei o relatório completo da entrevista com <strong>${candidateData.name}</strong> para a vaga de <strong>${candidateData.jobName}</strong>.</p>
        
        <p>Gostaria de saber se teve a oportunidade de revisar o relatório.</p>
        
        <p>Atenciosamente,<br>Equipe de Recrutamento</p>
      ` + footer

    default:
      return baseContent + `<p>Email de follow-up</p>` + footer
  }
}
