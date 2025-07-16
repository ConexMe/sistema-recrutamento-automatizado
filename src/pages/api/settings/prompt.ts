import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const defaultPrompt = `Você é um assistente especializado em análise de candidatos para processos de recrutamento.

Sua função é analisar o perfil de candidatos e determinar se eles têm "fit" ou "não fit" com a vaga especificada.

Para análise de FIT, considere:
- Experiência profissional relevante
- Habilidades técnicas necessárias
- Formação acadêmica
- Motivação e interesse na vaga
- Compatibilidade com os requisitos da posição

Para geração de relatórios de entrevista, você deve:
- Analisar a transcrição da entrevista
- Avaliar competências técnicas e comportamentais
- Fornecer recomendações estruturadas
- Destacar pontos fortes e áreas de melhoria
- Dar uma recomendação final (contratar/não contratar)

Sempre seja objetivo, profissional e baseie suas análises em critérios técnicos claros.`

      res.status(200).json({ prompt: defaultPrompt })
    } catch (error) {
      console.error('Erro ao buscar prompt:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else if (req.method === 'POST') {
    try {
      const { prompt } = req.body

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt é obrigatório' })
      }

      console.log('Prompt do sistema atualizado:', {
        prompt: prompt.substring(0, 100) + '...',
        updatedAt: new Date().toISOString()
      })

      res.status(200).json({ 
        message: 'Prompt do sistema atualizado com sucesso!',
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Erro ao salvar prompt:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}
