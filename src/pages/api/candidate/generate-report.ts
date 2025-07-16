import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { candidateId, interviewTranscription, jobContext } = req.body

    if (!candidateId) {
      return res.status(400).json({ error: 'ID do candidato é obrigatório' })
    }

    // Simular dados do candidato e entrevista
    const candidateData = {
      id: candidateId,
      name: 'João Silva',
      email: 'joao@email.com',
      jobName: 'Desenvolvedor Frontend',
      interviewDate: new Date().toISOString().split('T')[0]
    }

    // Transcrição simulada se não fornecida
    const transcription = interviewTranscription || `
Entrevistador: Conte-me sobre sua experiência com React.
Candidato: Trabalho com React há 3 anos, desenvolvi várias aplicações usando hooks, context API e integração com APIs REST.

Entrevistador: Como você lida com gerenciamento de estado?
Candidato: Uso Redux para aplicações complexas e Context API para estados mais simples. Também tenho experiência com Zustand.

Entrevistador: Fale sobre um projeto desafiador que você trabalhou.
Candidato: Desenvolvi um dashboard em tempo real que processava milhares de eventos por segundo, usando WebSockets e otimizações de performance.
`

    const jobContextInfo = jobContext || `
Vaga: Desenvolvedor Frontend Sênior
Requisitos: React, TypeScript, testes automatizados, experiência com performance
Responsabilidades: Liderar desenvolvimento de interfaces, mentoria de júniores, arquitetura frontend
`

    // Preparar prompt para geração do relatório
    const reportPrompt = `
Você é um especialista em recrutamento. Analise a entrevista abaixo e gere um relatório estruturado em HTML.

DADOS DO CANDIDATO:
Nome: ${candidateData.name}
Vaga: ${candidateData.jobName}
Data da Entrevista: ${candidateData.interviewDate}

CONTEXTO DA VAGA:
${jobContextInfo}

TRANSCRIÇÃO DA ENTREVISTA:
${transcription}

Gere um relatório completo em HTML com as seguintes seções:
1. Resumo Executivo
2. Avaliação Técnica
3. Competências Comportamentais
4. Pontos Fortes
5. Áreas de Melhoria
6. Recomendação Final (Contratar/Não Contratar)
7. Próximos Passos

Use formatação HTML profissional com estilos inline para um documento bem apresentado.
`

    let reportContent = ''
    const openrouterApiKey = process.env.OPENROUTER_API_KEY

    if (!openrouterApiKey) {
      // Relatório simulado se API não estiver configurada
      reportContent = generateMockReport(candidateData)
    } else {
      // Chamar API do OpenRouter para gerar relatório
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
                { type: 'text', text: reportPrompt }
              ]
            }
          ],
          max_tokens: 2000,
          temperature: 0.3
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const aiResponse = await response.json()
      reportContent = aiResponse.choices[0]?.message?.content || generateMockReport(candidateData)
    }

    // Salvar relatório (em um cenário real, salvaria em banco de dados ou storage)
    const reportId = `report_${candidateId}_${Date.now()}`
    const reportData = {
      id: reportId,
      candidateId,
      candidateName: candidateData.name,
      jobName: candidateData.jobName,
      content: reportContent,
      generatedAt: new Date().toISOString(),
      format: 'html'
    }

    console.log('Relatório gerado:', {
      reportId,
      candidateId,
      timestamp: new Date().toISOString()
    })

    res.status(200).json({
      message: 'Relatório gerado com sucesso!',
      reportId,
      reportData,
      downloadUrl: `/api/reports/${reportId}` // URL para download do relatório
    })

  } catch (error) {
    console.error('Erro ao gerar relatório:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

function generateMockReport(candidateData: any): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Entrevista - ${candidateData.name}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .section h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
        .recommendation { background: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #27ae60; }
        .score { display: inline-block; background: #3498db; color: white; padding: 5px 10px; border-radius: 3px; margin: 5px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Relatório de Entrevista</h1>
        <p><strong>Candidato:</strong> ${candidateData.name}</p>
        <p><strong>Vaga:</strong> ${candidateData.jobName}</p>
        <p><strong>Data:</strong> ${candidateData.interviewDate}</p>
    </div>

    <div class="section">
        <h2>1. Resumo Executivo</h2>
        <p>O candidato ${candidateData.name} demonstrou sólido conhecimento técnico e experiência relevante para a posição de ${candidateData.jobName}. Durante a entrevista, apresentou exemplos práticos de projetos desenvolvidos e mostrou capacidade de resolver problemas complexos.</p>
    </div>

    <div class="section">
        <h2>2. Avaliação Técnica</h2>
        <div class="score">React: 8/10</div>
        <div class="score">JavaScript: 8/10</div>
        <div class="score">TypeScript: 7/10</div>
        <div class="score">Performance: 8/10</div>
        <ul>
            <li>Demonstrou conhecimento avançado em React e hooks</li>
            <li>Experiência com gerenciamento de estado (Redux, Context API)</li>
            <li>Conhecimento em otimização de performance</li>
            <li>Experiência com WebSockets e aplicações em tempo real</li>
        </ul>
    </div>

    <div class="section">
        <h2>3. Competências Comportamentais</h2>
        <ul>
            <li><strong>Comunicação:</strong> Clara e objetiva, consegue explicar conceitos técnicos</li>
            <li><strong>Resolução de Problemas:</strong> Abordagem estruturada e lógica</li>
            <li><strong>Aprendizado:</strong> Demonstra interesse em novas tecnologias</li>
            <li><strong>Trabalho em Equipe:</strong> Experiência em projetos colaborativos</li>
        </ul>
    </div>

    <div class="section">
        <h2>4. Pontos Fortes</h2>
        <ul>
            <li>Sólida experiência técnica com React e ecossistema JavaScript</li>
            <li>Capacidade de trabalhar com aplicações complexas e de alta performance</li>
            <li>Boa comunicação técnica</li>
            <li>Experiência prática com projetos desafiadores</li>
        </ul>
    </div>

    <div class="section">
        <h2>5. Áreas de Melhoria</h2>
        <ul>
            <li>Poderia aprofundar conhecimentos em TypeScript</li>
            <li>Experiência com testes automatizados poderia ser expandida</li>
            <li>Conhecimento em arquitetura de sistemas frontend</li>
        </ul>
    </div>

    <div class="section">
        <h2>6. Recomendação Final</h2>
        <div class="recommendation">
            <h3>✅ RECOMENDO CONTRATAÇÃO</h3>
            <p>O candidato possui o perfil técnico e comportamental adequado para a vaga. Demonstrou experiência relevante e capacidade de contribuir efetivamente com a equipe.</p>
            <p><strong>Nível sugerido:</strong> Pleno/Sênior</p>
        </div>
    </div>

    <div class="section">
        <h2>7. Próximos Passos</h2>
        <ul>
            <li>Verificação de referências profissionais</li>
            <li>Discussão sobre expectativas salariais</li>
            <li>Apresentação da equipe e cultura da empresa</li>
            <li>Definição de data de início</li>
        </ul>
    </div>

    <hr style="margin-top: 40px;">
    <p style="text-align: center; color: #666; font-size: 12px;">
        Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}
    </p>
</body>
</html>
`
}
