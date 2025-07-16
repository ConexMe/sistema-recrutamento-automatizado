import { NextApiRequest, NextApiResponse } from 'next'

interface CandidateData {
  name: string
  email: string
  phone: string
  jobId: string
  experience: string
  skills: string
  education: string
  motivation: string
}

const jobRequirements: Record<string, string> = {
  'dev-frontend': 'Desenvolvedor Frontend: React, TypeScript, HTML, CSS, JavaScript, experiência com frameworks modernos',
  'dev-backend': 'Desenvolvedor Backend: Node.js, Python, Java, APIs REST, bancos de dados, arquitetura de sistemas',
  'dev-fullstack': 'Desenvolvedor Full Stack: Frontend e Backend, React, Node.js, bancos de dados, DevOps básico',
  'designer-ui': 'Designer UI/UX: Figma, Adobe XD, prototipagem, design thinking, experiência do usuário',
  'product-manager': 'Product Manager: gestão de produtos, metodologias ágeis, análise de dados, stakeholder management',
  'data-scientist': 'Cientista de Dados: Python, R, machine learning, estatística, SQL, visualização de dados'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const candidateData: CandidateData = req.body

    // Validação básica
    if (!candidateData.name || !candidateData.email || !candidateData.jobId) {
      return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' })
    }

    const jobRequirement = jobRequirements[candidateData.jobId]
    if (!jobRequirement) {
      return res.status(400).json({ error: 'Vaga não encontrada' })
    }

    // Preparar dados para análise da IA
    const analysisPrompt = `
Analise o seguinte candidato para a vaga especificada e determine se há FIT ou NÃO FIT.

VAGA: ${jobRequirement}

CANDIDATO:
Nome: ${candidateData.name}
Experiência: ${candidateData.experience}
Habilidades: ${candidateData.skills}
Formação: ${candidateData.education}
Motivação: ${candidateData.motivation}

Responda apenas com "fit" ou "não fit" baseado na compatibilidade entre o perfil do candidato e os requisitos da vaga.
`

    // Chamar API do OpenRouter
    const openrouterApiKey = process.env.OPENROUTER_API_KEY
    if (!openrouterApiKey) {
      console.log('Simulando análise de IA (chave não configurada)')
      // Simulação simples baseada em palavras-chave
      const candidateText = `${candidateData.experience} ${candidateData.skills}`.toLowerCase()
      const jobKeywords = jobRequirement.toLowerCase()
      
      let matchScore = 0
      const keywords = ['react', 'javascript', 'typescript', 'node', 'python', 'java', 'sql', 'figma', 'design']
      
      keywords.forEach(keyword => {
        if (candidateText.includes(keyword) && jobKeywords.includes(keyword)) {
          matchScore++
        }
      })
      
      const fit = matchScore >= 2 ? 'fit' : 'não fit'
      return res.status(200).json({ fit, message: 'Análise concluída com sucesso!' })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt }
            ]
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    const aiResponse = await response.json()
    const aiResult = aiResponse.choices[0]?.message?.content?.toLowerCase().trim()
    
    // Extrair resultado da resposta da IA
    let fit = 'não fit'
    if (aiResult?.includes('fit') && !aiResult?.includes('não fit')) {
      fit = 'fit'
    }

    // Aqui você salvaria o candidato no banco de dados
    console.log('Candidato analisado:', {
      ...candidateData,
      fit,
      analyzedAt: new Date().toISOString()
    })

    res.status(200).json({ 
      fit, 
      message: 'Análise concluída com sucesso!',
      candidateId: Date.now().toString() // ID temporário
    })

  } catch (error) {
    console.error('Erro na análise de fit:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
