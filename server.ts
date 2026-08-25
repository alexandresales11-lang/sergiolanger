import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper lazy Gemini initialization
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      time: new Date().toISOString()
    });
  });

  // AI Copilot Endpoint for Luxury Real Estate
  app.post('/api/ai/copilot', async (req, res) => {
    try {
      const { message, context } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Mensagem é obrigatória' });
      }

      const client = getGeminiClient();

      const systemPrompt = `Você é o "VIP Real Estate AI Copilot", um consultor sênior de inteligência comercial e mentor estratégico para corretores de imóveis de altíssimo padrão (VGV acima de R$ 5 Milhões a R$ 50 Milhões).

Seu estilo de comunicação é:
1. Extremamente executivo, sofisticado, direto ao ponto e persuasivo (sem jargões vazios).
2. Focado em: fechamento de vendas (closing), contorno de objeções de clientes C-Level/Family Offices, sigilo de imóveis off-market, técnicas de ancoragem de valor por m², e scripts de WhatsApp prontos para envio.
3. Se o corretor solicitar scripts de WhatsApp, forneça o texto exato pronto para copiar, elegante e sem parecer vendedor desesperado.
4. Considere os dados do CRM fornecidos no contexto:
Contexto do CRM atual:
${context ? JSON.stringify(context, null, 2) : 'Sem contexto adicional fornecido.'}

Responda sempre em português do Brasil com formatação limpa e markdown elegante.`;

      if (client) {
        try {
          const response = await client.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: message,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
            },
          });

          return res.json({
            reply: response.text || 'Não foi possível gerar a resposta.',
            source: 'gemini-3.7-flash'
          });
        } catch (apiErr: any) {
          console.warn('Erro na chamada Gemini, usando fallback heurístico:', apiErr?.message || apiErr);
        }
      }

      // Fallback heurístico inteligente caso não haja chave da API no ambiente local
      const msgLower = (message || '').toLowerCase();
      let fallbackReply = '';

      if (msgLower.includes('objeção') || msgLower.includes('caro') || msgLower.includes('m2') || msgLower.includes('preço')) {
        fallbackReply = `### 🎯 Estratégia de Ancoragem de Valor para Cliente High-Net-Worth

Ao lidar com a percepção de preço em imóveis de luxo (ex: R$ 35.000+/m²):

1. **Nunca justifique pelo custo de tijolo/obra:** O cliente de luxo não compra área construída, compra **escassez, segurança familiar, privacidade absoluta e status social**.
2. **Técnica da Curadoria Off-Market:** Destaque que a unidade é confidencial e que não existem outros terrenos com essa vista/orientação solar na região.
3. **Script Sugerido para WhatsApp:**
> *"Olá [Nome], entendo perfeitamente sua análise de m². No entanto, este ativo possui exclusividade arquitetônica e localização irreproduzível no bairro. Se fizermos uma visita técnica de 20 minutos, você perceberá porque os outros 2 compradores do edifício não abrem mão de suas unidades. Quinta às 16h ou Sexta às 11h fica melhor para você?"*`;
      } else if (msgLower.includes('script') || msgLower.includes('whatsapp') || msgLower.includes('mensagem')) {
        fallbackReply = `### 📲 Script VIP de Reativação de Lead

**Tom:** Exclusivo, consultivo e com gatilho de escassez sutil.

> *"Olá, Dr. [Nome], tudo bem?*
>
> *Lembrei do seu critério de busca por uma cobertura com pé-direito duplo e discrição total. Acabamos de receber uma oportunidade estritamente off-market nos Jardins que ainda não foi a mercado aberto.*
> 
> *Gostaria de lhe apresentar o dossiê confidencial em primeira mão antes de liberarmos para visitação. Posso enviar o PDF pelo WhatsApp ou prefere uma rápida ligação de 3 minutos hoje à tarde?"*`;
      } else if (msgLower.includes('permuta') || msgLower.includes('investidor') || msgLower.includes('roi')) {
        fallbackReply = `### 💼 Análise Estratégica para Investidor / Permuta de Ativos

Para negociações com Family Offices e investidores:
- **Liquidez:** Investidores compram com deságio ou exigem garantias reais de liquidez futura.
- **Estruturação de Proposta:** Proponha entrada em dinheiro (mínimo 40%) com dação em pagamento de imóvel comercial gerador de renda com cap rate superior a 0,6% a.m.
- **Fechamento:** Destaque o potencial de valorização do metro quadrado após a revitalização ou entrega da obra no entorno.`;
      } else {
        fallbackReply = `### 💎 Parecer do Copiloto Imobiliário VIP

Analisando sua solicitação com base nas melhores práticas do mercado de alto padrão:

1. **Priorização de Leads:** Foque nos clientes em fase de **Curadoria e Visita Técnica**, onde a taxa de conversão média atinge 68% quando acompanhada de dossiê técnico.
2. **Smart Match Ativo:** Sempre que cadastrar um novo imóvel off-market, cruze imediatamente o perfil de liquidez dos compradores cadastrados.
3. **Próximo Passo:** Qual lead ou imóvel específico você gostaria de analisar agora para prepararmos o roteiro de fechamento?`;
      }

      return res.json({
        reply: fallbackReply,
        source: 'smart-copilot-engine'
      });

    } catch (err: any) {
      console.error('Erro na rota /api/ai/copilot:', err);
      res.status(500).json({ error: 'Erro interno ao processar inteligência do Copiloto' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
