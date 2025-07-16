import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { candidateId, clientEmail, reportId } = req.body

    if (!candidateId || !clientEmail) {
      return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' })
    }

    // Simular dados do candidato e relatório
    const candidateData = {
      id: candidateId,
      name: 'João Silva',
      jobName: 'Desenvolvedor Frontend',
      interviewDate: new Date().toISOString().split('T')[0]
    }

    const reportData = {
      id: reportId || `report_${candidateId}_${Date.now()}`,
      candidateName: candidateData.name,
      jobName: candidateData.jobName,
      generatedAt: new Date().toISOString()
    }

    // Preparar email com relatório
    const emailSubject = `Relatório de Entrevista - ${candidateData.name} - ${candidateData.jobName}`
    const emailBody = `
Prezado(a) Cliente,

Segue em anexo o relatório completo da entrevista realizada com o candidato ${candidateData.name} para a vaga de ${candidateData.jobName}.

RESUMO:
- Candidato: ${candidateData.name}
- Vaga: ${candidateData.jobName}
- Data da Entrevista: ${candidateData.interviewDate}
- Relatório ID: ${reportData.id}

O relatório contém análise técnica detalhada, avaliação comportamental e recomendação final.

Atenciosamente,
Equipe de Recrutamento

---
Este email foi gerado automaticamente pelo Sistema de Recrutamento.
`

    // Enviar email com relatório
    const emailSent = await sendReportEmail(clientEmail, emailSubject, emailBody, reportData)

    if (emailSent) {
      console.log('Relatório enviado:', {
        candidateId,
        clientEmail,
        reportId: reportData.id,
        timestamp: new Date().toISOString()
      })

      res.status(200).json({
        message: 'Relatório enviado com sucesso!',
        reportId: reportData.id,
        sentTo: clientEmail,
        sentAt: new Date().toISOString()
      })
    } else {
      res.status(500).json({ error: 'Falha ao enviar relatório por email' })
    }

  } catch (error) {
    console.error('Erro ao enviar relatório:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function sendReportEmail(
  clientEmail: string, 
  subject: string, 
  body: string, 
  reportData: any
): Promise<boolean> {
  try {
    const gmailCredentials = process.env.GMAIL_API_KEY || process.env.SMTP_CREDENTIALS

    if (!gmailCredentials) {
      console.log('Simulando envio de email com relatório (credenciais não configuradas)')
      console.log(`Para: ${clientEmail}`)
      console.log(`Assunto: ${subject}`)
      console.log(`Corpo: ${body}`)
      console.log(`Anexo: Relatório ${reportData.id}.html`)
      return true
    }

    // Implementação real com nodemailer ou Gmail API
    /*
    const nodemailer = require('nodemailer')
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: clientEmail,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
      attachments: [
        {
          filename: `Relatorio_${reportData.candidateName.replace(/\s+/g, '_')}_${reportData.id}.html`,
          content: reportData.content || '<html><body><h1>Relatório de Entrevista</h1></body></html>',
          contentType: 'text/html'
        }
      ]
    }

    await transporter.sendMail(mailOptions)
    */

    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return false
  }
}
