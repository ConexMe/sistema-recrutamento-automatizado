# Sistema de Recrutamento Automatizado

Sistema inteligente para automatizar processos de recrutamento com IA, integrações de API e fluxos automatizados.

## 🚀 Funcionalidades

### ✅ Análise de Fit com IA
- Avaliação automática de candidatos usando OpenAI GPT-4o
- Análise baseada em experiência, habilidades e requisitos da vaga
- Resultado: FIT ou NÃO FIT

### 📅 Agendamento Automático
- Integração com Cal.com para links de agendamento
- Envio automático por email e WhatsApp
- Links personalizados por candidato e vaga

### 📊 Relatórios Inteligentes
- Geração automática de relatórios pós-entrevista
- Análise técnica e comportamental
- Recomendações estruturadas em HTML

### 📧 Comunicação Automatizada
- Envio de relatórios para clientes
- Feedback personalizado via WhatsApp
- Sequência de follow-up a cada 48h

### 📈 Dashboard Completo
- Visão geral de todos os candidatos
- Controle de status por etapa
- Ações manuais quando necessário

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **IA**: OpenRouter API (GPT-4o)
- **Integrações**: Cal.com, Gmail/SMTP, WhatsApp APIs

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Chaves de API (opcionais para teste)

## 🚀 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd sistema-recrutamento
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env.local
```

4. **Edite o arquivo .env.local com suas chaves de API**
```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
CAL_API_KEY=cal_your-key-here
GMAIL_API_KEY=your-gmail-api-key
WHATSAPP_API_KEY=your-whatsapp-api-key
```

5. **Execute o projeto**
```bash
npm run dev
```

6. **Acesse o sistema**
```
http://localhost:8000
```

## 📖 Como Usar

### 1. Cadastro de Candidatos
- Acesse `/candidate`
- Preencha o formulário completo
- A IA analisará automaticamente o fit

### 2. Dashboard de RH
- Acesse `/dashboard`
- Visualize todos os candidatos
- Execute ações conforme o fluxo:
  - **Agendar Entrevista** → Envia link Cal.com
  - **Gerar Relatório** → Cria relatório com IA
  - **Enviar Relatório** → Envia para cliente
  - **Enviar Feedback** → WhatsApp para candidato
  - **Iniciar Follow-up** → Sequência de emails

### 3. Configurações
- Acesse `/settings`
- Configure o prompt da IA
- Adicione suas chaves de API

## 🔄 Fluxo Automatizado

```
Candidato se inscreve
    ↓
IA analisa FIT/NÃO FIT
    ↓
[Se FIT] RH agenda entrevista
    ↓
Sistema envia link Cal.com
    ↓
Após entrevista → Gerar relatório
    ↓
IA cria relatório estruturado
    ↓
Enviar relatório para cliente
    ↓
Enviar feedback para candidato
    ↓
Iniciar follow-up com empresa
```

## 🔧 APIs Disponíveis

### Candidatos
- `POST /api/candidate/fit` - Análise de fit
- `POST /api/candidate/schedule` - Agendamento
- `POST /api/candidate/generate-report` - Gerar relatório
- `POST /api/candidate/send-report` - Enviar relatório
- `POST /api/candidate/send-feedback` - Feedback WhatsApp
- `POST /api/candidate/followup` - Follow-up emails

### Configurações
- `GET/POST /api/settings/prompt` - Prompt da IA
- `POST /api/settings/keys` - Chaves de API

## 🔑 Integrações

### OpenRouter (IA)
```javascript
// Endpoint: https://openrouter.ai/api/v1/chat/completions
// Modelo: openai/gpt-4o
// Uso: Análise de fit e geração de relatórios
```

### Cal.com (Agendamento)
```javascript
// Integração com API do Cal.com
// Links personalizados por candidato
// Metadata incluindo nome e vaga
```

### WhatsApp (Feedback)
```javascript
// Suporte para Twilio ou Z-API
// Mensagens personalizadas
// Feedback positivo/negativo
```

### Email (Relatórios/Follow-up)
```javascript
// Gmail API ou SMTP
// Anexos HTML/DOCX
// Sequência automatizada
```

## 🎨 Interface

- **Design**: Moderno e minimalista
- **Cores**: Preto e branco com acentos
- **Tipografia**: Google Fonts (Inter)
- **Responsivo**: Mobile-first
- **Acessibilidade**: WCAG 2.1

## 🧪 Modo de Teste

O sistema funciona sem chaves de API:
- Simulação de análise de IA
- Logs no console para debugging
- Dados mockados para demonstração

## 📝 Personalização

### Prompt da IA
Acesse `/settings` para customizar como a IA analisa candidatos e gera relatórios.

### Vagas Disponíveis
Edite `src/pages/api/candidate/fit.ts` para adicionar novas vagas e requisitos.

### Templates de Email
Modifique `src/pages/api/candidate/followup.ts` para personalizar templates.

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Outras Plataformas
```bash
npm run build
npm start
```

## 📊 Monitoramento

- Logs detalhados no console
- Timestamps em todas as ações
- Status tracking por candidato
- Métricas de conversão

## 🔒 Segurança

- Chaves de API em variáveis de ambiente
- Validação de entrada em todas as APIs
- Rate limiting (implementar em produção)
- Sanitização de dados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte:
- Abra uma issue no GitHub
- Entre em contato via email
- Consulte a documentação das APIs integradas

---

**Sistema de Recrutamento Automatizado** - Transformando processos de RH com inteligência artificial.
